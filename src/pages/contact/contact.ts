import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { User, GlobalStatictVar } from '../../shared/interfaces';
import { MediatorProvider } from '../../providers/mediatorProvider';
import { Conversation } from '../conversation/conversation';
import { ProfilePage } from '../profile/profile';
import { Subscription } from 'rxjs/Subscription';
import { LogProvider } from '../../providers/logProvider';
import { AuthService } from '../../providers/auth-service/auth-service';



@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})
export class ContactPage {


  contacts: User[] = new Array();
  users: User[] = new Array();
  defaultPhoto = GlobalStatictVar.DEFAULT_PROFILE_PHOTO;
  loggedinUser: User;
  itemSubscription: Subscription;
  searchKey = '';

  constructor(public authService:AuthService, public navCtrl: NavController, public medProvid: MediatorProvider, public logProvid: LogProvider) {
  }

  ionViewDidLoad() {

    this.loggedinUser = this.authService.getUserLocal();
  }

  ionViewWillEnter() {
     this.initContacts();
    //this.getUsers();
     this.loadOnlineUsers(); //Async
  }

 getUsers(){
   this.authService.getAllUsers().then((res:any)=>{
     this.contacts = res;
   })
 }
  initContacts() {
    this.contacts = new Array();
    var self = this;
    this.medProvid.getContacts().then((data) => {
      self.logProvid.log('ldb contact loaded: '+data.res.rows.length);
      if (data.res.rows.length > 0) {
        for (let i = 0; i < data.res.rows.length; i++) {
          let item = data.res.rows.item(i);
          if (item.uid==this.loggedinUser.uid) {
            continue;
          }
          let user = {
            id: item.id,
            uid: item.uid,
            username: item.email,
            firstName:item.firstName,
            lastName:item.lastName,
            displayName:item.firstName+" "+item.lastName,
            email: item.email,
            photoURL: item.photoURL,
            isContact: true
          }
          if (user===undefined) {
            continue;
          }
          self.contacts.push(user);
          self.logProvid.log('local contact pushed: '+user.username);
        }
      }
    }, (error) => {
      self.logProvid.log('get contacts error: ' , error);
    });
  }

  search(event: any) {
    //I'm calling this here in case { you may open the app and it's offline
    //but when you are about to type search the app became online }
    //this.loadOnlineUsers();

    var self = this;
    let val: string = event.target.value;
    if (val && val.trim() != '') {
      this.contacts = new Array();
      //filter users contacts ( LocalStorage )
      this.contacts.filter((item) => {
        if (item.displayName.toLowerCase().includes(val.toLowerCase())) {
          self.contacts.push(item);
        }
      });

      //filter online users
      this.users.filter((item) => {
        if (item.displayName.toLowerCase().includes(val.toLowerCase()) ) {
          this.contacts.push(item);
        }
      });

      this.logProvid.log('local contacts: ' + this.contacts.length);
      this.logProvid.log('online contacts: ' + this.users.length);
    } else {
      //reload user's contacts from ( localstorage )
      this.contacts = new Array();
      this.initContacts();
      this.loadOnlineUsers(); //Async
    }
  }

  loadOnlineUsers() {
    //this is not the correct solution to be used when you have a hundreds or more users
    //because this app is just prototype so I use this way to search for users
    //If you are willing to implement a proper full-text search in firebase you should consider using https://github.com/firebase/flashlight
    let items ;
    this.medProvid.getUsers().then((result)=>{
    	items = result;
    	//console.log(result);
    //console.log(items);
    this.users = new Array();
    this.deAttach();
    var self = this;
   // this.itemSubscription = items.subscribe(snapshots => {
      items.forEach(snapshot => {

        var childData = snapshot;//.val();
        let user = childData;
        user.diplayName = childData.firstName+" "+childData.lastName;
       /* let user = {
          uid: childData.uid,
          username: childData.email,
          displayName: childData.firstName+" "+childData.lastName,
          email: childData.email,
          photo: childData.photo,
          isContact: true,
        }*/
        self.users.push(user);
        self.contacts.push(user);
        self.logProvid.log('online user pushed: ' + user.displayName);
      });
    //});
    });
  }

  openConversation(user) {
    this.navCtrl.push(Conversation, user);
  }

  openProfile(user) {
    this.navCtrl.push(ProfilePage, { user: user });
  }

  addContact(user) {
    //this.medProvid.addContact(this.loggedinUser.uid, user);
    //this.contacts.push(user);
  }

  removeContact(index, contact) {
   // this.medProvid.removeContact(contact.id);
   // this.contacts.splice(index);
  }

  ionViewWillLeave() {
    this.deAttach();
    this.searchKey = '';
  }

  deAttach() {
    if (this.itemSubscription) {
      this.itemSubscription.unsubscribe();
    }
  }
}
