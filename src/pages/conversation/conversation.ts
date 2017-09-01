import { Component, ViewChild, ChangeDetectorRef, Input } from '@angular/core';
import { Platform, NavParams, Events, Content, NavController } from 'ionic-angular';
import { Subscription } from 'rxjs/Subscription';
import { User, Chat, Message, GlobalStatictVar } from '../../shared/interfaces';
import { MediatorProvider } from '../../providers/mediatorProvider';
import { ImgHandlerProvider } from '../../providers/img-handler/img-handler';
import { LogProvider } from '../../providers/logProvider';
import { AuthService } from '../../providers/auth-service/auth-service';
import { Keyboard } from '@ionic-native/keyboard';


@Component({
  selector: 'page-conversation',
  templateUrl: 'conversation.html'
})
export class Conversation {

  message: string;

  loggedinUser: User;
  dateVisible: boolean = false;
  user: User;
  title: string;
  chat: Chat;
  @Input()
  messages: Message[] = new Array();
  @ViewChild(Content) chatContainer: Content;

  //UserStatus sil est sur la page ou pas { using the ionic lifecycle events }
  //if you want to know more about navigating lifecycle events in ionic go here http://blog.ionic.io/navigating-lifecycle-events/
  isUserHere: boolean = false;

  constructor(private platform: Platform, private keyboard: Keyboard, public navCtrl:NavController ,public authService:AuthService, public imgHandler:ImgHandlerProvider,private navParam: NavParams, public medProvid: MediatorProvider, public events: Events, public logProvid: LogProvider
    , public changeDetectionRef: ChangeDetectorRef) {
    this.user = this.navParam.data;
    events.subscribe(GlobalStatictVar.NEW_MESSAGE_EVENT, (message, sender) => {
      this.messageArrived(message, sender);
    });
    if (platform.is('ios')) {
      let  appEl = <HTMLElement>(document.getElementsByTagName('ION-APP')[0]),
      appElHeight = appEl.clientHeight;
      this.keyboard.disableScroll(true);
      this.keyboard.onKeyboardShow().subscribe((e)=>{
        appEl.style.height = (appElHeight - (<any>e).keyboardHeight) + 'px';
      })
      window.addEventListener('native.keyboardhide', () => {
        appEl.style.height = '100%';
      });
    }
  }
  goBack(){
    this.navCtrl.pop();
  }
  change() {
    // get elements
    var element   = document.getElementById('input');
    var textarea  = element.getElementsByTagName('textarea')[0];

    // set default style for textarea
    textarea.style.minHeight  = '0';
    textarea.style.height     = '0';

    // limit size to 96 pixels (6 lines of text)
    var scroll_height = textarea.scrollHeight;
    if(scroll_height > 96)
      scroll_height = 96;

    // apply new style
    element.style.height      = scroll_height + "px";
    textarea.style.minHeight  = scroll_height + "px";
    textarea.style.height     = scroll_height + "px";
  }
  showDate(){
    this.dateVisible = !this.dateVisible;
  }
  ionViewDidLoad() {
    //we only need this call for one time when view loaded to cach
    this.loggedinUser = this.authService.getUserLocal();
    // this.loggedinUser = this.medProvid.loggedinUser;
    //this.scrollChat();
  }

  ionViewWillEnter() {
    //this must be call everytime user enter this page
    this.user = this.navParam.data;
    this.initChats();
    this.isUserHere = true;
  }

  ionViewDidEnter() {
    this.scrollChat();
  }

  initChats() {
    this.messages = new Array();
    var self = this;
    this.medProvid.getChat(this.loggedinUser.uid, this.user.uid).then((data) => {
      if (data.res.rows.length > 0) {
        let item = data.res.rows.item(0);
        this.chat = {
          id: item.id,
          uid: item.uid,
          uid2: item.uid2,
          datetime: item.datetime,
          lastMsgText: item.lastMsgText,
          lastMsgDate: item.lastMsgDate,
          recieverName: item.recieverName,
          recieverPhoto: item.recieverPhoto,
          notify: item.notify
        }
        if (self.chat.notify == 1) {//Le chat a ete lu donc supprime le badge
          self.events.publish(GlobalStatictVar.NOTIFICATION_EVENT, false);
          self.chat.notify = 0;
          self.medProvid.updateChat(this.chat);
        }
      } else {

        this.chat = {
          uid: this.loggedinUser.uid,
          uid2: this.user.uid,
          datetime: new Date().getTime(),
          lastMsgText: "",
          lastMsgDate: new Date().getTime(),
          recieverName: this.user.displayName,
          recieverPhoto: this.user.photoURL,
          notify: 0
        }
        this.medProvid.addChat(this.chat);
        self.medProvid.addChatUser(self.user);
      }
    }, (error) => {
      this.logProvid.log('error getting chats: ' + error);
    });

    this.medProvid.getMessages(self.loggedinUser.uid, self.user.uid).then((data) => {
      if (data.res.rows.length > 0) {
        for (let i = 0; i < data.res.rows.length; i++) {
          let item = data.res.rows.item(i);
          let currMsg = {
            id: item.id,
            uid: item.uid,
            from: item.fromUid,
            to: item.toUid,
            body: item.body,
            type: item.msgType,
            datetime: item.msgDate,
            status: item.msgStatus,
          }
          self.messages.push(currMsg);
          this.scrollChat();
        }
      }
    }, (error) => {
      this.logProvid.log(error);
    });

    this.logProvid.log('Chat messages count: ' + self.messages.length);
    this.messages.sort(function (val1, val2) {
      return val1.datetime - val2.datetime;
    });
  }
  sendPicture(){
    this.imgHandler.storeImage().then((imgUrl:any)=>{
      this.message = imgUrl;
      this.send("", GlobalStatictVar.MSG_TYPE_PHOTO)
    })
  }
  send(input: any, msgType=GlobalStatictVar.MSG_TYPE_MSG) {

    //pas de pace pour  les msg vide
    if (!this.message || this.message.trim() == '') {
      return;
    }

    let msg = {
      uid: this.loggedinUser.uid,
      from: this.loggedinUser.uid,
      to: this.user.uid,
      body: this.message,
      type: msgType,
      datetime: new Date().getTime(),
      status: GlobalStatictVar.MSG_STATUS_UN_READ,
      sentstatus: GlobalStatictVar.MSG_STATUS_SENT
    }


    //If the online status false message will be put in Firebase queue mais
    //J'utilse le mien 
    //  if (this.medProvid.onlineStatus) {
      this.medProvid.sendMessage(msg);
      this.logProvid.log('msg sent!');
      // } else {
        //online DB is offline add msg to queue
        // msg.sentstatus = GlobalStatictVar.MSG_STATUS_UN_SENT;
        // this.medProvid.addMessageToQueue(msg);
        // this.logProvid.log('msg queued!');
        //  }
        if(msg.type==GlobalStatictVar.MSG_TYPE_PHOTO){
          msg.body='image...';
        }
        this.updateChat(this.chat, msg.body, msg.datetime);
        this.messages.push(msg);
        this.message = "";
        this.change();
        this.scrollChat();
        input.setFocus();
        this.changeDetectionRef.detectChanges();
        this.logProvid.log('check chat: ' + this.chat.id);
      }


      updateChat(chat, lastMsgText, lastMsgDate) {
        //call cette fonction pour chaque msg sent/recieve
        //Je pouvait a faire quant on sort (ionViewWillLeave) mais l'app peut cracher ou si le user quit 
        //aors pour faire sur que le chat est a jour dans le local db
        chat.lastMsgText = lastMsgText;
        chat.lastMsgDate = lastMsgDate;
        this.medProvid.updateChat(chat);
      }

      scrollChat() {
        setTimeout(()=>{
          this.chatContainer.scrollToBottom(300);
        }, 500)

      }

      ionViewWillLeave() {
        //Supprimer le chat s'il ya pas de message entre deux users
        if (this.messages.length == 0) {
          this.medProvid.removeChate(this.chat);
          this.logProvid.log('chat vide supprimer');
        }
        this.deAttach();
        this.isUserHere = false;
      }

      deAttach() {
        if (this.events) {
          this.events.unsubscribe(GlobalStatictVar.NEW_MESSAGE_EVENT);
        }
      }

      messageArrived(message, senderUser) {
        if (this.isUserHere) {
          if (this.user.uid == message.uid) {

            this.messages.push(message);
            this.scrollChat();
            this.changeDetectionRef.detectChanges();
            this.logProvid.log('new message arrive');
            this.events.publish(GlobalStatictVar.NOTIFICATION_EVENT, false);
          }
        }
      }
    }
