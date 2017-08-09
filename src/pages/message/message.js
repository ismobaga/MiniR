var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, Input, ChangeDetectorRef } from '@angular/core';
import { NavParams, NavController, Events, App } from 'ionic-angular';
import { GlobalStatictVar } from '../../shared/interfaces';
import { MediatorProvider } from '../../providers/mediatorProvider';
import { MessageDetailPage } from '../message-detail/message-detail';
import { ContactPage } from '../contact/contact';
import { LogProvider } from '../../providers/logProvider';
import { Conversation } from '../conversation/conversation';
/**
 * Generated class for the MessagePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
var MessagePage = (function () {
    function MessagePage(navCtrl, navParams, app, medProvid, events, logProvid, changeDetectionRef) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.app = app;
        this.medProvid = medProvid;
        this.events = events;
        this.logProvid = logProvid;
        this.changeDetectionRef = changeDetectionRef;
        this.messages = [
            {
                id: 1,
                profile_img: 'http://malimoncton.ga/storage/tommy.jpg',
                sender: 'Tommy Bia',
                last_message: 'How you doin?',
                time: '6h'
            },
            {
                id: 2,
                profile_img: 'http://malimoncton.ga/storage/membre/youba.jpg',
                sender: 'Youba Smk',
                last_message: 'Ouais?',
                time: '6h'
            },
            {
                id: 3,
                profile_img: 'http://malimoncton.ga/storage/membre/raoul.jpg',
                sender: 'Raoul Boudou',
                last_message: 'LOL. Ionic in 2017',
                time: '11h'
            },
            {
                id: 4,
                profile_img: 'http://malimoncton.ga/storage/membre/ismail.jpg',
                sender: 'Ismail Bagayoko',
                last_message: 'si je te dit',
                time: '1d'
            }
        ];
        this.chats = new Array();
        this.defaultPhoto = GlobalStatictVar.DEFAULT_PROFILE_PHOTO;
        this.chatMap = new Map();
    }
    MessagePage.prototype.ionViewDidLoad = function () {
        var _this = this;
        console.log('ionViewDidLoad MessagePage');
        this.events.subscribe(GlobalStatictVar.NEW_MESSAGE_EVENT, function (message, senderUser) {
            _this.messageArrived(message, senderUser);
        });
    };
    MessagePage.prototype.ionViewWillEnter = function () {
        this.initChats();
        //this.medProvid.removeAllChats();
        this.logProvid.log('chats loaded!');
    };
    MessagePage.prototype.initChats = function () {
        this.chats = new Array();
        this.chatMap.clear();
        var self = this;
        this.medProvid.getChats().then(function (data) {
            if (data.res.rows.length > 0) {
                var _loop_1 = function (i) {
                    var item = data.res.rows.item(i);
                    var currChat = {
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
                    };
                    //Sometimes I'm not sure what is happening with the date pipe in chat.html so I wanted to be sure nothing wrong with the view
                    //Just in testing case 
                    if (item.lastMsgDate === undefined) {
                        currChat.lastMsgDate = new Date().getTime();
                    }
                    //Fill user in chat as object to get photo etc
                    self.medProvid.getChatUser(currChat.uid2).then(function (data) {
                        if (data.res.rows.length > 0) {
                            var item_1 = data.res.rows.item(0);
                            currChat.user = {
                                uid: item_1.uid,
                                username: item_1.username,
                                email: item_1.email,
                                photo: item_1.photo
                            };
                        }
                        self.chats.push(currChat);
                        self.chatMap.set(currChat.uid2, currChat);
                        self.logProvid.log('chat notify: ' + currChat.notify);
                        if (currChat.notify == 1) {
                            self.events.publish(GlobalStatictVar.NOTIFICATION_EVENT, true);
                        }
                    }, function (err) {
                        self.logProvid.log('Fill user in chat err: ' + err);
                    });
                };
                for (var i = 0; i < data.res.rows.length; i++) {
                    _loop_1(i);
                }
            }
        }, function (error) {
            self.logProvid.log('error getting chat: ', error);
        });
        this.chats.sort(function (val1, val2) {
            return val1.lastMsgDate - val2.lastMsgDate;
        });
    };
    MessagePage.prototype.ionViewWillUnload = function () {
        this.logProvid.log('view unloaded!');
        this.events.unsubscribe(GlobalStatictVar.NEW_MESSAGE_EVENT);
    };
    MessagePage.prototype.messageArrived = function (message, senderUser) {
        var self = this;
        var chat = this.chatMap.get(message.from);
        if (chat) {
            chat.lastMsgDate = message.datetime;
            chat.lastMsgText = message.body;
            chat.recieverPhoto = senderUser.photo;
            chat.notify = 1;
            this.logProvid.log('message new pushed ');
            this.chats.sort(function (val1, val2) {
                return val1.lastMsgDate - val2.lastMsgDate;
            });
            this.changeDetectionRef.detectChanges();
            this.medProvid.updateChat(chat); //Update the notify 
        }
        else {
            this.medProvid.getChat(message.from, message.to).then(function (data) {
                if (data.res.rows.length > 0) {
                    var item = data.res.rows.item(0);
                    var chat_1 = {
                        id: item.id,
                        uid: item.uid,
                        uid2: item.uid2,
                        datetime: item.datetime,
                        lastMsgText: message.body,
                        lastMsgDate: message.datetime,
                        recieverName: senderUser.username,
                        recieverPhoto: senderUser.photo,
                        user: senderUser,
                        notify: 1
                    };
                    self.logProvid.log('chat new pushed ');
                    //self.chats.push(chat);
                    self.chats.unshift(chat_1);
                    self.chatMap.set(chat_1.uid2, chat_1);
                    self.changeDetectionRef.detectChanges();
                    self.medProvid.updateChat(chat_1);
                }
            }, function (err) {
                self.logProvid.log('error getting chat: ' + err);
            });
        }
        //Update chat tab badge
        self.events.publish(GlobalStatictVar.NOTIFICATION_EVENT, true);
    };
    MessagePage.prototype.openConversation = function (user) {
        this.navCtrl.push(Conversation, user);
    };
    MessagePage.prototype.removeChat = function (index, chat) {
        this.medProvid.removeChate(chat);
        this.chatMap.delete(chat.uid2);
        this.chats.splice(index);
    };
    MessagePage.prototype.isToday = function (date) {
        var today = new Date();
        var chatDate = new Date(date);
        if (today.getFullYear() === chatDate.getFullYear() && today.getMonth() === chatDate.getMonth() && today.getDate() === chatDate.getDate()) {
            return true;
        }
        else {
            return false;
        }
    };
    MessagePage.prototype.isYesterday = function (date) {
        var todayDate = new Date();
        var chatDate = new Date(date);
        if (todayDate.getFullYear() === chatDate.getFullYear() && todayDate.getMonth() === chatDate.getMonth()) {
            if (todayDate.getDate() - chatDate.getDate() == 1) {
                return true;
            }
            else {
                return false;
            }
        }
        else {
            return false;
        }
    };
    MessagePage.prototype.goNewMessage = function () {
        this.app.getRootNav().push(ContactPage);
        // this.app.getRootNav().push(NewMessagePage);
    };
    MessagePage.prototype.goMessageDetail = function (sender, profile_img, last_message) {
        this.app.getRootNav().push(MessageDetailPage, { sender: sender, profile_img: profile_img, last_message: last_message });
    };
    MessagePage.prototype.delete = function (item) {
    };
    MessagePage.prototype.mute = function (item) {
    };
    MessagePage.prototype.more = function (item) {
    };
    return MessagePage;
}());
__decorate([
    Input(),
    __metadata("design:type", Array)
], MessagePage.prototype, "chats", void 0);
MessagePage = __decorate([
    Component({
        selector: 'page-message',
        templateUrl: 'message.html',
    }),
    __metadata("design:paramtypes", [NavController,
        NavParams, App,
        MediatorProvider, Events,
        LogProvider, ChangeDetectorRef])
], MessagePage);
export { MessagePage };
//# sourceMappingURL=message.js.map