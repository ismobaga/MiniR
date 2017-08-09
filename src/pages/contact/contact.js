var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { GlobalStatictVar } from '../../shared/interfaces';
import { MediatorProvider } from '../../providers/mediatorProvider';
import { Conversation } from '../conversation/conversation';
import { ProfilePage } from '../profile/profile';
import { LogProvider } from '../../providers/logProvider';
var ContactPage = (function () {
    function ContactPage(navCtrl, medProvid, logProvid) {
        this.navCtrl = navCtrl;
        this.medProvid = medProvid;
        this.logProvid = logProvid;
        this.contacts = new Array();
        this.users = new Array();
        this.defaultPhoto = GlobalStatictVar.DEFAULT_PROFILE_PHOTO;
        this.searchKey = '';
    }
    ContactPage.prototype.ionViewDidLoad = function () {
        this.loggedinUser = this.medProvid.loggedinUser;
    };
    ContactPage.prototype.ionViewWillEnter = function () {
        this.initContacts();
        this.loadOnlineUsers(); //Async
    };
    ContactPage.prototype.initContacts = function () {
        this.contacts = new Array();
        var self = this;
        this.medProvid.getContacts().then(function (data) {
            self.logProvid.log('ldb contact loaded: ' + data.res.rows.length);
            if (data.res.rows.length > 0) {
                for (var i = 0; i < data.res.rows.length; i++) {
                    var item = data.res.rows.item(i);
                    var user = {
                        id: item.id,
                        uid: item.uid,
                        username: item.username,
                        email: item.email,
                        photo: item.photo,
                        isContact: true
                    };
                    self.contacts.push(user);
                    self.logProvid.log('local contact pushed: ' + user.username);
                }
            }
        }, function (error) {
            self.logProvid.log('get contacts error: ', error);
        });
    };
    ContactPage.prototype.search = function (event) {
        //I'm calling this here in case { you may open the app and it's offline
        //but when you are about to type search the app became online }
        //this.loadOnlineUsers();
        var self = this;
        var val = event.target.value;
        if (val && val.trim() != '') {
            this.contacts = new Array();
            //filter users contacts ( LocalStorage )
            this.contacts.filter(function (item) {
                if (item.username.toLowerCase().includes(val.toLowerCase())) {
                    self.contacts.push(item);
                }
            });
            //filter online users
            this.users.filter(function (item) {
                if (item.username.toLowerCase().includes(val.toLowerCase())) {
                    self.contacts.push(item);
                }
            });
            this.logProvid.log('local contacts: ' + this.contacts.length);
            this.logProvid.log('online contacts: ' + this.users.length);
        }
        else {
            //reload user's contacts from ( localstorage )
            this.contacts = new Array();
            this.initContacts();
            this.loadOnlineUsers(); //Async
        }
    };
    ContactPage.prototype.loadOnlineUsers = function () {
        var _this = this;
        //this is not the correct solution to be used when you have a hundreds or more users
        //because this app is just prototype so I use this way to search for users
        //If you are willing to implement a proper full-text search in firebase you should consider using https://github.com/firebase/flashlight
        var items;
        this.medProvid.getUsers().then(function (result) {
            items = result;
            console.log(result);
            console.log(items);
            _this.users = new Array();
            _this.deAttach();
            var self = _this;
            // this.itemSubscription = items.subscribe(snapshots => {
            items.forEach(function (snapshot) {
                var childData = snapshot; //.val();
                var user = {
                    uid: childData.uid,
                    username: childData.username,
                    email: childData.email,
                    photo: childData.photo,
                };
                self.users.push(user);
                self.logProvid.log('online user pushed: ' + user.username);
            });
            //});
        });
    };
    ContactPage.prototype.openConversation = function (user) {
        this.navCtrl.push(Conversation, user);
    };
    ContactPage.prototype.openProfile = function (user) {
        this.navCtrl.push(ProfilePage, { user: user });
    };
    ContactPage.prototype.addContact = function (user) {
        this.medProvid.addContact(this.loggedinUser.uid, user);
        //this.contacts.push(user);
    };
    ContactPage.prototype.removeContact = function (index, contact) {
        this.medProvid.removeContact(contact.id);
        this.contacts.splice(index);
    };
    ContactPage.prototype.ionViewWillLeave = function () {
        this.deAttach();
        this.searchKey = '';
    };
    ContactPage.prototype.deAttach = function () {
        if (this.itemSubscription) {
            this.itemSubscription.unsubscribe();
        }
    };
    return ContactPage;
}());
ContactPage = __decorate([
    Component({
        selector: 'page-contact',
        templateUrl: 'contact.html'
    }),
    __metadata("design:paramtypes", [NavController, MediatorProvider, LogProvider])
], ContactPage);
export { ContactPage };
//# sourceMappingURL=contact.js.map