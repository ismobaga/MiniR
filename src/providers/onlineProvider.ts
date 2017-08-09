import * as firebase from 'firebase';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { MediatorProvider } from '../providers/mediatorProvider';
import { User, GlobalStatictVar } from '../shared/interfaces';
import 'rxjs/add/operator/map';
import {Observable} from 'rxjs/observable';
import { Events } from 'ionic-angular';
import { LogProvider } from '../providers/logProvider';
import { AuthService } from './auth-service/auth-service';


const MESSAGES_REF: string = '/messages';
const USERS_REF: string = '/users';
const CHATS_REF: string = '/chats';
const CONTACT_REF: string = '/contacts';

@Injectable()
export class OnlineProvider {

  connectionRef: any;
  loggedinUser: User;

  constructor(public afAuth: AngularFireAuth,public authService:AuthService,public http: Http, private angularFire: AngularFireDatabase, public events: Events, public logProvid: LogProvider) {
  }

  initConnectionStatus() {
    this.connectionRef = this.angularFire.object('.info/connected', { preserveSnapshot: true });
    this.connectionRef.subscribe(snapshot => {
      if (snapshot.val() === true) {
        this.logProvid.log('Database connected!');
        this.events.publish(GlobalStatictVar.ONLINE_EVENT);
        this.initLoggedinUser();
      } else {
        this.logProvid.log('Database disConnected!');
        this.events.publish(GlobalStatictVar.OFFLINE_EVENT);
      }
    });
  }

  createAccount(user: User) {
    //return this.angularFire.auth.createUser({ email: user.email, password: user.password });
  };

  login(user: User) {
    //return this.angularFire.auth.login({ email: user.email, password: user.password });
  }
  logout() {
   return this.afAuth.auth.signOut();
  }
  initLoggedinUser() {
    var user = firebase.auth().currentUser;
    this.logProvid.log('onlinePro::initLoggedinUser:: ' + user);
    if (!user) {
      return;
    }

    var self = this;
    let uid = firebase.auth().currentUser.uid;
    this.logProvid.log('loggedin uid: ' + uid);

    //let userRef = this.angularFire.object(`${USERS_REF}/${uid}`, { preserveSnapshot: true });
    //userRef.subscribe(snapshot => {
      this.getUser(uid).then((result)=>{

      let value = result;
      self.loggedinUser = {
        uid: value['uid'],
        username: value['username'],
        email: value['email'],
        photo: value['profile_image']
      }
      this.events.publish(GlobalStatictVar.ONLINE_USER_EVENT, self.loggedinUser);
      });
  // });
  }

  updateUser(user: User) {
    let currentUserRef = this.angularFire.object(`${USERS_REF}/${user.uid}`);
    currentUserRef.set({
      id: user.id,
      uid: user.uid,
      username: user.username,
      email: user.email,
      photo: user.photo
    });

    let onlineUser = firebase.auth().currentUser;

    onlineUser.updateProfile({
      displayName: user.username,
      photoURL: user.photo
    }).then(function () {
    }, function (error) {
    });
  }

  getUsers()  {
    let url='http://cdi.x10.mx/api/users';
    return this.authService.postData('','users');
    
   // let users= new Array;
/*  //   return new Promise((resolve, reject) => {
      //this.http.post(apiUrl + type, JSON.stringify(donnees), {headers: headers})
      this.http.get(url)
        .subscribe(res => {
          resolve(res.json());
        }, (err) => {
          reject(err);
        });
    });    
      */
    //return users;
    //return Observable.from(users);

     // Call the translation service for each item.
    // .mergeMap(item =>
   //this.commonModel.translate(item.label)
     // Store the translation in an object with the shape you want.
   //  .map(translatedLabel => ({ label: translatedLabel }))
 //)

 // Use this to put back all translated items in a single array again.
 //.toArray();
    //return this.angularFire.list(USERS_REF, { preserveSnapshot: true });
  }

  filterUsersByName(username) {
    return this.angularFire.list(USERS_REF, {
      query: {
        orderByChild: 'username',
        startAt: username,
      }, preserveSnapshot: true
    });
  }
  userPostData= {user_id:'', token:''}
  //get user information { just for test }
  getUser(uid) {
      const userData = JSON.parse(localStorage.getItem('userData'));
      let userDetails = userData.userData;
      this.userPostData.user_id = userDetails.id;
      this.userPostData.token = userDetails.token;

    let data;
     return this.authService.postData(this.userPostData, 'user/'+uid);
     //   setTimeout(function () {
           
      //  },1000);
       // return data;
    // return firebase.database().ref(`${USERS_REF}/${uid}`);

  }

  sendMessage(message) {
    let currentUserRef = this.angularFire.list(`${CHATS_REF}/${message.to}/${message.from}`);
    return currentUserRef.push(message);
  }

  updateMessageStatus(key, message, newStatus) {
    let currentUserRef = this.angularFire.object(`${CHATS_REF}/${message.to}/${message.from}/${key}`);
    currentUserRef.update({ status: newStatus });
  }

  //Mesages queries
  getUserMessagesRef(uid) {
    return firebase.database().ref(`${CHATS_REF}/${uid}`);
  }

  getUnReadMessagesRef(uid, uid2) {
    return firebase.database().ref(`${CHATS_REF}/${uid}/${uid2}`).orderByChild('status').equalTo(GlobalStatictVar.MSG_STATUS_UN_READ);
  }

  //END of messages queries
  addContact(uid, user) {
    let currentUserRef = this.angularFire.list(`${CONTACT_REF}/${uid}`);
    currentUserRef.push({
      uid: user.uid,
      username: user.username,
      email: user.email,
      photo: user.photo
    });
  }

  ngOnDestroy() {
    if (this.connectionRef) {
      this.connectionRef.unsubscribe();
    }
  }
}
