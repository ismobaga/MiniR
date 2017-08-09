var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, ViewChild, ChangeDetectorRef, Input } from '@angular/core';
import { NavParams, Events, Content } from 'ionic-angular';
import { GlobalStatictVar } from '../../shared/interfaces';
import { MediatorProvider } from '../../providers/mediatorProvider';
import { LogProvider } from '../../providers/logProvider';
var Conversation = (function () {
    function Conversation(navParam, medProvid, events, logProvid, changeDetectionRef) {
        var _this = this;
        this.navParam = navParam;
        this.medProvid = medProvid;
        this.events = events;
        this.logProvid = logProvid;
        this.changeDetectionRef = changeDetectionRef;
        this.messages = new Array();
        //User status if he is in this page or not { using the ionic lifecycle events }
        //if you want to know more about navigating lifecycle events in ionic go here http://blog.ionic.io/navigating-lifecycle-events/
        this.isUserHere = false;
        this.user = this.navParam.data;
        events.subscribe(GlobalStatictVar.NEW_MESSAGE_EVENT, function (message, sender) {
            _this.messageArrived(message, sender);
        });
    }
    Conversation.prototype.ionViewDidLoad = function () {
        //we only need this call for one time when view loaded to cach
        this.loggedinUser = this.medProvid.loggedinUser;
        //this.scrollChat();
    };
    Conversation.prototype.ionViewWillEnter = function () {
        //this must be call everytime user enter this page
        this.user = this.navParam.data;
        this.initChats();
        this.isUserHere = true;
    };
    Conversation.prototype.ionViewDidEnter = function () {
        this.scrollChat();
    };
    Conversation.prototype.initChats = function () {
        var _this = this;
        this.messages = new Array();
        var self = this;
        this.medProvid.getChat(this.loggedinUser.uid, this.user.uid).then(function (data) {
            if (data.res.rows.length > 0) {
                var item = data.res.rows.item(0);
                self.chat = {
                    id: item.id,
                    uid: item.uid,
                    uid2: item.uid2,
                    datetime: item.datetime,
                    lastMsgText: item.lastMsgText,
                    lastMsgDate: item.lastMsgDate,
                    recieverName: item.recieverName,
                    recieverPhoto: item.recieverPhoto,
                    notify: item.notify
                };
                if (self.chat.notify == 1) {
                    self.events.publish(GlobalStatictVar.NOTIFICATION_EVENT, false);
                    self.chat.notify = 0;
                    self.medProvid.updateChat(_this.chat);
                }
            }
            else {
                self.chat = {
                    uid: _this.loggedinUser.uid,
                    uid2: _this.user.uid,
                    datetime: new Date().getTime(),
                    lastMsgText: "",
                    lastMsgDate: new Date().getTime(),
                    recieverName: _this.user.username,
                    recieverPhoto: _this.user.photo,
                    notify: 0
                };
                _this.medProvid.addChat(_this.chat);
                self.medProvid.addChatUser(self.user);
            }
        }, function (error) {
            _this.logProvid.log('error getting chats: ' + error);
        });
        this.medProvid.getMessages(self.loggedinUser.uid, self.user.uid).then(function (data) {
            if (data.res.rows.length > 0) {
                for (var i = 0; i < data.res.rows.length; i++) {
                    var item = data.res.rows.item(i);
                    var currMsg = {
                        id: item.id,
                        uid: item.uid,
                        from: item.fromUid,
                        to: item.toUid,
                        body: item.body,
                        type: item.msgType,
                        datetime: item.msgDate,
                        status: item.msgStatus,
                    };
                    self.messages.push(currMsg);
                    self.scrollChat();
                }
            }
        }, function (error) {
            _this.logProvid.log(error);
        });
        this.logProvid.log('Chat messages count: ' + self.messages.length);
        this.messages.sort(function (val1, val2) {
            return val1.datetime - val2.datetime;
        });
    };
    Conversation.prototype.send = function (input) {
        //no place for empty msg
        if (!this.message || this.message.trim() == '') {
            return;
        }
        var msg = {
            uid: this.loggedinUser.uid,
            from: this.loggedinUser.uid,
            to: this.user.uid,
            body: this.message,
            type: GlobalStatictVar.MSG_TYPE_MSG,
            datetime: new Date().getTime(),
            status: GlobalStatictVar.MSG_STATUS_UN_READ,
            sentstatus: GlobalStatictVar.MSG_STATUS_SENT
        };
        //If the online status false message will be put in Firebase queue and I don't want this
        //I'm using my own queue here 
        if (this.medProvid.onlineStatus) {
            this.medProvid.sendMessage(msg);
            this.logProvid.log('msg sent!');
        }
        else {
            //online DB is offline add msg to queue
            msg.sentstatus = GlobalStatictVar.MSG_STATUS_UN_SENT;
            this.medProvid.addMessageToQueue(msg);
            this.logProvid.log('msg queued!');
        }
        this.updateChat(this.chat, msg.body, msg.datetime);
        this.messages.push(msg);
        this.message = "";
        this.scrollChat();
        input.setFocus();
        this.changeDetectionRef.detectChanges();
        this.logProvid.log('check chat: ' + this.chat.id);
    };
    Conversation.prototype.updateChat = function (chat, lastMsgText, lastMsgDate) {
        //call this update on every message sent/recieve
        //I can make this call in ionViewWillLeave but in some cases app may crash or user just close it 
        //so I make sure chat vars are up to date in local db
        chat.lastMsgText = lastMsgText;
        chat.lastMsgDate = lastMsgDate;
        this.medProvid.updateChat(chat);
    };
    Conversation.prototype.scrollChat = function () {
        this.chatContainer.scrollToBottom(300);
    };
    Conversation.prototype.ionViewWillLeave = function () {
        //Chat must be deleted if there were no messages between users
        if (this.messages.length == 0) {
            this.medProvid.removeChate(this.chat);
            this.logProvid.log('empty chat deleted');
        }
        this.deAttach();
        this.isUserHere = false;
    };
    Conversation.prototype.deAttach = function () {
        if (this.events) {
            this.events.unsubscribe(GlobalStatictVar.NEW_MESSAGE_EVENT);
        }
    };
    Conversation.prototype.messageArrived = function (message, senderUser) {
        if (this.isUserHere) {
            if (this.user.uid == message.uid) {
                this.messages.push(message);
                this.scrollChat();
                this.changeDetectionRef.detectChanges();
                this.logProvid.log('message pushed: ');
                this.events.publish(GlobalStatictVar.NOTIFICATION_EVENT, false);
            }
        }
    };
    return Conversation;
}());
__decorate([
    Input(),
    __metadata("design:type", Array)
], Conversation.prototype, "messages", void 0);
__decorate([
    ViewChild(Content),
    __metadata("design:type", Content)
], Conversation.prototype, "chatContainer", void 0);
Conversation = __decorate([
    Component({
        selector: 'page-conversation',
        templateUrl: 'conversation.html'
    }),
    __metadata("design:paramtypes", [NavParams, MediatorProvider, Events, LogProvider,
        ChangeDetectorRef])
], Conversation);
export { Conversation };
//# sourceMappingURL=conversation.js.map