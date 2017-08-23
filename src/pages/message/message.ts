import { Component, Input, ChangeDetectorRef } from '@angular/core';
import { NavParams, NavController, Events, App } from 'ionic-angular';

import { GlobalStatictVar } from '../../shared/interfaces';
import { Chat } from '../../shared/interfaces';
import { MediatorProvider } from '../../providers/mediatorProvider';


import { MessageDetailPage } from '../message-detail/message-detail';
import { NewMessagePage } from '../new-message/new-message';
import { ContactPage } from '../contact/contact';
import { LogProvider } from '../../providers/logProvider';
import { Conversation } from '../conversation/conversation';

/**
 * Generated class for the MessagePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-message',
  templateUrl: 'message.html',
})
export class MessagePage {

   @Input()
  chats: Chat[] = new Array();
  defaultPhoto = GlobalStatictVar.DEFAULT_PROFILE_PHOTO;
  chatMap = new Map();
  constructor(public navCtrl: NavController, 
    public navParams: NavParams, private app: App,
    public medProvid: MediatorProvider, public events: Events,
    public logProvid: LogProvider, public changeDetectionRef: ChangeDetectorRef) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MessagePage');
     this.events.subscribe(GlobalStatictVar.NEW_MESSAGE_EVENT, (message, senderUser) => {
      this.messageArrived(message, senderUser);
    });
  }

  ionViewWillEnter() {
    this.initChats();
   //this.medProvid.removeAllChats();
    this.logProvid.log('chats charger!');
  }

  initChats() {
    this.chats = new Array();
    this.chatMap.clear();
    
    this.medProvid.getChats().then((data) => {

      if (data.res.rows.length > 0) {
        for (let i = 0; i < data.res.rows.length; i++) {
          let item = data.res.rows.item(i);
          let currChat = {
            id: item.id,
            uid: item.uid,
            uid2: item.uid2,
            datetime: item.datetime,
            lastMsgText: item.lastMsgText,
            lastMsgDate: item.lastMsgDate,
            recieverName: item.recieverName,
            recieverPhoto: item.recieverPhoto,
            notify: item.notify,
            user: undefined
          }
          //Sometimes I'm not sure what is happening with the date pipe in chat.html so I wanted to be sure nothing wrong with the view
          //Just in testing case 
          if (item.lastMsgDate === undefined) {
            currChat.lastMsgDate = new Date().getTime();
          }

          //Fill user in chat as object to get photo etc
          this.medProvid.getChatUser(currChat.uid2).then((data) => {
            if (data.res.rows.length > 0) {
              let item = data.res.rows.item(0);
              currChat.user = {
                uid: item.uid,
                username: item.email,
                displayName: item.displayName,
                email: item.email,
                photoURL: item.photoURL
              }
            }
            this.chats.push(currChat);
            this.chatMap.set(currChat.uid2, currChat);
            this.logProvid.log('chat notify: ' + currChat.notify);
            if (currChat.notify == 1) {//Fire notification event to add badge in chat tab
              this.events.publish(GlobalStatictVar.NOTIFICATION_EVENT, true);
            }
          }, (err)=> {
            this.logProvid.log('Fill user in chat err: ' + err);
          });
        }
      }
      else{
       // this.userMessagesRef = this.onlineProv.getUserMessagesRef(this.loggedinUser.uid);
      }
    }, (error) => {
      this.logProvid.log('MessagePage error getting chat: ', error);
    });

    this.chats.sort(function (val1, val2) {
      return val1.lastMsgDate - val2.lastMsgDate;
    });
  }
  ionViewWillUnload() {
    this.logProvid.log('MessagePage view unloaded!');
    this.events.unsubscribe(GlobalStatictVar.NEW_MESSAGE_EVENT);
  }
  
  messageArrived(message, senderUser) {
    let self =this;
    let chat: Chat = this.chatMap.get(message.from);
    if (chat) {
      chat.lastMsgDate = message.datetime;
      chat.lastMsgText = message.body;
      chat.recieverName = senderUser.displayName;
      if(message.type===GlobalStatictVar.MSG_TYPE_PHOTO)
        {
          chat.lastMsgText = "image...";
        }
      chat.recieverPhoto = senderUser.photoURL;
      chat.notify = 1;
      this.logProvid.log('message new pushed ');
      this.chats.sort(function (val1, val2) {
        return val1.lastMsgDate - val2.lastMsgDate;
      });
      self.changeDetectionRef.detectChanges();
      self.medProvid.updateChat(chat);//Update the notify 
    } else {//This means it's a new chat 
      this.medProvid.getChat(message.from, message.to).then((data) => {
        if (data.res.rows.length > 0) {
          let item = data.res.rows.item(0);
          let chat = {
            id: item.id,
            uid: item.uid,
            uid2: item.uid2,
            datetime: item.datetime,
            lastMsgText: message.body,

            lastMsgDate: message.datetime,
            recieverName: senderUser.displayName,
            recieverPhoto: senderUser.photoURL,
            user: senderUser,
            notify: 1
          }
           if(message.type===GlobalStatictVar.MSG_TYPE_PHOTO)
        {
          chat.lastMsgText = "image...";
        }
          self.logProvid.log('chat new pushed ');
          self.chats.push(chat);
          self.chats.unshift(chat);
          self.chatMap.set(chat.uid2, chat);
          self.changeDetectionRef.detectChanges();
          self.medProvid.updateChat(chat);
        }
      }, (err) =>{

      this.logProvid.log('MessagePage error getting chat: ' + err);
      });
    }

    //Update chat tab badge
    this.events.publish(GlobalStatictVar.NOTIFICATION_EVENT, true);
  }
  openConversation(user) {
   this.navCtrl.push(Conversation, user);
  }

  removeChat(index, chat) {
    this.medProvid.removeChate(chat);
    this.chatMap.delete(chat.uid2);
    this.chats.splice(index);
  }

  isToday(date) {
    let today = new Date();
    let chatDate = new Date(date);
    if (today.getFullYear() === chatDate.getFullYear() && today.getMonth() === chatDate.getMonth() && today.getDate() === chatDate.getDate()) {
      return true;
    } else {
      return false;
    }
  }

  isYesterday(date) {
    let todayDate = new Date();
    let chatDate = new Date(date);
    if (todayDate.getFullYear() === chatDate.getFullYear() && todayDate.getMonth() === chatDate.getMonth()) {
      if (todayDate.getDate() - chatDate.getDate() == 1) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }










    goNewMessage() {
    this.app.getRootNav().push(ContactPage);
    // this.app.getRootNav().push(NewMessagePage);
  }

  goMessageDetail(sender:string, profile_img:string, last_message:string){
  	this.app.getRootNav().push(MessageDetailPage, { sender: sender, profile_img: profile_img, last_message: last_message});
  }
  delete(item){

  }

  mute(item){

  }
  more(item){

  }

}
