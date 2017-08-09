var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import * as firebase from 'firebase';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { AngularFireDatabase } from 'angularfire2/database';
import { GlobalStatictVar } from '../shared/interfaces';
import 'rxjs/add/operator/map';
import { Events } from 'ionic-angular';
import { LogProvider } from '../providers/logProvider';
import { AuthService } from './auth-service/auth-service';
var MESSAGES_REF = '/messages';
var USERS_REF = '/users';
var CHATS_REF = '/chats';
var CONTACT_REF = '/contacts';
var OnlineProvider = (function () {
    function OnlineProvider(authService, http, angularFire, events, logProvid) {
        this.authService = authService;
        this.http = http;
        this.angularFire = angularFire;
        this.events = events;
        this.logProvid = logProvid;
    }
    OnlineProvider.prototype.initConnectionStatus = function () {
        var _this = this;
        this.connectionRef = this.angularFire.object('.info/connected', { preserveSnapshot: true });
        this.connectionRef.subscribe(function (snapshot) {
            if (snapshot.val() === true) {
                _this.logProvid.log('Database connected!');
                _this.events.publish(GlobalStatictVar.ONLINE_EVENT);
                _this.initLoggedinUser();
            }
            else {
                _this.logProvid.log('Database disConnected!');
                _this.events.publish(GlobalStatictVar.OFFLINE_EVENT);
            }
        });
    };
    OnlineProvider.prototype.createAccount = function (user) {
        //return this.angularFire.auth.createUser({ email: user.email, password: user.password });
    };
    ;
    OnlineProvider.prototype.login = function (user) {
        //return this.angularFire.auth.login({ email: user.email, password: user.password });
    };
    OnlineProvider.prototype.initLoggedinUser = function () {
        var _this = this;
        var user = firebase.auth().currentUser;
        this.logProvid.log('onlinePro::initLoggedinUser:: ' + user);
        if (!user) {
            return;
        }
        var self = this;
        var uid = firebase.auth().currentUser.uid;
        this.logProvid.log('loggedin uid: ' + uid);
        var userRef = this.angularFire.object(USERS_REF + "/" + uid, { preserveSnapshot: true });
        userRef.subscribe(function (snapshot) {
            var value = snapshot.val();
            self.loggedinUser = {
                uid: value.uid,
                username: value.username,
                email: value.email,
                photo: value.photo
            };
            _this.events.publish(GlobalStatictVar.ONLINE_USER_EVENT, self.loggedinUser);
        });
    };
    OnlineProvider.prototype.updateUser = function (user) {
        var currentUserRef = this.angularFire.object(USERS_REF + "/" + user.uid);
        currentUserRef.set({
            id: user.id,
            uid: user.uid,
            username: user.username,
            email: user.email,
            photo: user.photo
        });
        var onlineUser = firebase.auth().currentUser;
        onlineUser.updateProfile({
            displayName: user.username,
            photoURL: user.photo
        }).then(function () {
        }, function (error) {
        });
    };
    OnlineProvider.prototype.getUsers = function () {
        var url = 'http://cdi.x10.mx/api/users';
        return this.authService.postData('', 'users');
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
    };
    OnlineProvider.prototype.filterUsersByName = function (username) {
        return this.angularFire.list(USERS_REF, {
            query: {
                orderByChild: 'username',
                startAt: username,
            }, preserveSnapshot: true
        });
    };
    //get user information { just for test }
    OnlineProvider.prototype.getUser = function (uid) {
        return firebase.database().ref(USERS_REF + "/" + uid);
    };
    OnlineProvider.prototype.sendMessage = function (message) {
        var currentUserRef = this.angularFire.list(CHATS_REF + "/" + message.to + "/" + message.from);
        return currentUserRef.push(message);
    };
    OnlineProvider.prototype.updateMessageStatus = function (key, message, newStatus) {
        var currentUserRef = this.angularFire.object(CHATS_REF + "/" + message.to + "/" + message.from + "/" + key);
        currentUserRef.update({ status: newStatus });
    };
    //Mesages queries
    OnlineProvider.prototype.getUserMessagesRef = function (uid) {
        return firebase.database().ref(CHATS_REF + "/" + uid);
    };
    OnlineProvider.prototype.getUnReadMessagesRef = function (uid, uid2) {
        return firebase.database().ref(CHATS_REF + "/" + uid + "/" + uid2).orderByChild('status').equalTo(GlobalStatictVar.MSG_STATUS_UN_READ);
    };
    //END of messages queries
    OnlineProvider.prototype.addContact = function (uid, user) {
        var currentUserRef = this.angularFire.list(CONTACT_REF + "/" + uid);
        currentUserRef.push({
            uid: user.uid,
            username: user.username,
            email: user.email,
            photo: user.photo
        });
    };
    OnlineProvider.prototype.ngOnDestroy = function () {
        if (this.connectionRef) {
            this.connectionRef.unsubscribe();
        }
    };
    return OnlineProvider;
}());
OnlineProvider = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [AuthService, Http, AngularFireDatabase, Events, LogProvider])
], OnlineProvider);
export { OnlineProvider };
//# sourceMappingURL=onlineProvider.js.map