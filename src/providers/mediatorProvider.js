var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from '@angular/core';
import { BackendProvider } from '../providers/backendProvider';
import { OnlineProvider } from '../providers/onlineProvider';
import { LogProvider } from '../providers/logProvider';
import { GlobalStatictVar } from '../shared/interfaces';
import { Events, ToastController } from 'ionic-angular';
var MediatorProvider = (function () {
    function MediatorProvider(backProvid, onlineProv, events, toastCtrl, logProvid) {
        this.backProvid = backProvid;
        this.onlineProv = onlineProv;
        this.events = events;
        this.toastCtrl = toastCtrl;
        this.logProvid = logProvid;
        this.logProvid.log('init Mediator provider');
    }
    MediatorProvider.prototype.initLocaleDB = function () {
        this.initMediator();
    };
    MediatorProvider.prototype.initMediator = function () {
        var _this = this;
        this.onlineProv.initConnectionStatus();
        this.initLogedinUser();
        this.events.subscribe(GlobalStatictVar.ONLINE_EVENT, function () {
            _this.logProvid.log('App online');
            _this.onlineStatus = true;
            _this.onOnline();
        });
        this.events.subscribe(GlobalStatictVar.OFFLINE_EVENT, function () {
            _this.logProvid.log('App offline');
            _this.onlineStatus = false;
            _this.onOffline();
        });
        this.events.subscribe(GlobalStatictVar.ONLINE_USER_EVENT, function (loggedinUser) {
            _this.onOnlineUser(loggedinUser);
        });
    };
    MediatorProvider.prototype.subscribeToMessages = function () {
        var self = this;
        this.userMessagesRef = this.onlineProv.getUserMessagesRef(this.loggedinUser.uid);
        this.userMessagesRef.on('child_changed', function (element) {
            var senderUID = element.key;
            self.logProvid.log('senderID: ' + senderUID);
            self.onlineProv.getUnReadMessagesRef(self.loggedinUser.uid, senderUID).once('value').then(function (snapshot) {
                snapshot.forEach(function (childSnapshot) {
                    var childKey = childSnapshot.key;
                    var msgData = childSnapshot.val();
                    self.logProvid.log('eleM: ' + childKey);
                    self.logProvid.log('eleM: ' + msgData.body);
                    var msg = {
                        uid: msgData.uid,
                        from: msgData.from,
                        to: msgData.to,
                        onlineKey: childKey,
                        body: msgData.body,
                        type: msgData.type,
                        datetime: msgData.datetime,
                        status: msgData.status,
                        sentstatus: msgData.sentstatus
                    };
                    self.logProvid.log("msg arrived from: " + msg.from);
                    self.logProvid.log("msg arrived to: " + msg.to);
                    //updating the sender info { now what I do care for is sender photo }
                    var userRef = self.onlineProv.getUser(senderUID);
                    userRef.once('value').then(function (snapshot) {
                        var value = snapshot.val();
                        var senderUser = {
                            uid: value.uid,
                            username: value.username,
                            email: value.email,
                            photo: value.photo
                        };
                        self.logProvid.log('msg published');
                        self.messageRecieved(msg, senderUser);
                    }, function (error) {
                        self.logProvid.log('erro: ' + error);
                    });
                });
                self.logProvid.log('end messageRef for!');
            }, function (err) {
                self.logProvid.log('error getting chat: ' + err);
            });
        });
    };
    MediatorProvider.prototype.initLogedinUser = function () {
        var self = this;
        this.backProvid.getUser().then(function (data) {
            if (data.res.rows.length > 0) {
                var item = data.res.rows.item(0);
                var user = {
                    id: item.id,
                    uid: item.uid,
                    username: item.username,
                    email: item.email,
                    photo: item.photo
                };
                self.loggedinUser = user;
                self.backProvid.initUser();
                self.logProvid.log('loggedinUser: ' + self.loggedinUser);
            }
        }, function (error) {
            self.logProvid.log('get user error: ' + error);
        });
    };
    MediatorProvider.prototype.createUser = function (user) {
        return this.onlineProv.createAccount(user);
    };
    MediatorProvider.prototype.login = function (user) {
        return this.onlineProv.login(user);
    };
    MediatorProvider.prototype.saveRegisteredUser = function (newUser) {
        var self = this;
        this.backProvid.addUser(newUser).then(function () {
            self.backProvid.getUser().then(function (data) {
                if (data.res.rows.length > 0) {
                    var item = data.res.rows.item(0);
                    var user = {
                        id: item.id,
                        uid: item.uid,
                        username: item.username,
                        email: item.email,
                        photo: item.photo
                    };
                    self.loggedinUser = user;
                    self.backProvid.user = user;
                    self.onlineProv.updateUser(user); //Update user info on online db in /Users/ references & user profile ( auth user )
                    self.subscribeToMessages();
                }
            }, function (error) {
                self.logProvid.log('get user error: ' + error);
            });
            self.logProvid.log('User inserted');
        }, function (error) {
            self.logProvid.log('Insert user error: ' + error.message);
        });
    };
    MediatorProvider.prototype.saveLoggedinUser = function (newUser) {
        var self = this;
        /*  this.onlineProv.getUser(newUser.uid).once('value').then(function (snapshot) { //get the online info { username & photo }
              let value = snapshot.val();
              let onlineUser = {
                  uid: value.uid,
                  username: value.username,
                  email: value.email,
                  photo: value.photo
              }
              newUser.username = onlineUser.username;
              newUser.photo = onlineUser.photo*/
        ////
        self.backProvid.addUser(newUser).then(function () {
            self.backProvid.getUser().then(function (data) {
                if (data.res.rows.length > 0) {
                    var item = data.res.rows.item(0);
                    var user = {
                        id: item.id,
                        uid: item.uid,
                        username: item.username,
                        email: item.email,
                        photo: item.photo
                    };
                    self.loggedinUser = user;
                    self.backProvid.user = user;
                    self.subscribeToMessages();
                }
            }, function (error) {
                self.logProvid.log('get user error: ' + error);
            });
            self.logProvid.log('User inserted');
        }, function (error) {
            self.logProvid.log('Insert user error: ' + error.message);
        });
    };
    MediatorProvider.prototype.updateUserPhoto = function (newUser) {
        //Update user photo on both { online , local }
        var self = this;
        this.backProvid.getUser().then(function (data) {
            if (data.res.rows.length > 0) {
                var item = data.res.rows.item(0);
                var user = {
                    id: item.id,
                    uid: newUser.uid,
                    username: newUser.username,
                    email: newUser.email,
                    photo: newUser.photo
                };
                self.loggedinUser = user;
                self.backProvid.user = user;
                self.backProvid.updateUser(user); //Update user photo on local db
                self.onlineProv.updateUser(user); //Update user photo on online db in /Users/ references & user profile ( auth user )
            }
        }, function (error) {
            self.logProvid.log(error);
        });
    };
    MediatorProvider.prototype.getChat = function (uid, uid2) {
        return this.backProvid.getChat(uid, uid2);
    };
    MediatorProvider.prototype.getContacts = function () {
        return this.backProvid.getContacts();
    };
    MediatorProvider.prototype.addContact = function (uid, user) {
        this.backProvid.addContact(user);
        this.onlineProv.addContact(uid, user);
    };
    MediatorProvider.prototype.removeContact = function (contactId) {
        this.backProvid.removeContact(contactId);
    };
    MediatorProvider.prototype.updateContacts = function () {
    };
    MediatorProvider.prototype.getUsers = function () {
        return this.onlineProv.getUsers();
    };
    MediatorProvider.prototype.filterUsersByName = function (username) {
        return this.onlineProv.filterUsersByName(username);
    };
    MediatorProvider.prototype.getUser = function (uid) {
        return this.onlineProv.getUser(uid);
    };
    MediatorProvider.prototype.getChats = function () {
        return this.backProvid.getChats();
    };
    MediatorProvider.prototype.addChat = function (chat) {
        return this.backProvid.addChat(chat);
    };
    MediatorProvider.prototype.updateChat = function (chat) {
        this.backProvid.updateChat(chat);
    };
    MediatorProvider.prototype.addChatUser = function (user) {
        this.backProvid.addChatUser(user);
    };
    MediatorProvider.prototype.getChatUser = function (uid) {
        return this.backProvid.getChatUser(uid);
    };
    MediatorProvider.prototype.sendMessage = function (message) {
        this.backProvid.addMessage(message);
        return this.onlineProv.sendMessage(message);
    };
    MediatorProvider.prototype.sendMessageOnline = function (message) {
        this.onlineProv.sendMessage(message);
    };
    MediatorProvider.prototype.saveMessage = function (message) {
        this.backProvid.addMessage(message);
    };
    //get old messages from local db
    MediatorProvider.prototype.getMessages = function (uid, uid2) {
        return this.backProvid.getMessages(uid, uid2);
    };
    MediatorProvider.prototype.addMessageToQueue = function (message) {
        this.backProvid.addMessageQueue(message);
    };
    MediatorProvider.prototype.onOnline = function () {
        if (!this.loggedinUser) {
            return; //local db corrupted 
        }
        this.unsubscribeRefs();
        //when app goes online launch message subscription
        this.subscribeToMessages();
        var self = this;
        //Get un-sent from message queue and send it to the online db
        this.backProvid.getMessagesQueue().then(function (data) {
            if (data.res.rows.length > 0) {
                var _loop_1 = function (i) {
                    var item = data.res.rows.item(i);
                    var currMsg = {
                        id: item.id,
                        originalMsgId: item.originalMsgId,
                        uid: item.uid,
                        from: item.fromUid,
                        to: item.toUid,
                        body: item.body,
                        type: item.msgType,
                        datetime: item.msgDate,
                        status: item.msgStatus
                    };
                    self.onlineProv.sendMessage(currMsg).then(function (_) {
                        //update msg sentStatus to MSG_STATUS_SENT
                        self.backProvid.updateMessageStatusSent(currMsg.originalMsgId, GlobalStatictVar.MSG_STATUS_SENT);
                        self.logProvid.log('queued message sent');
                        //remove msg from queue after it has been sent online 
                        self.backProvid.removeMessageQueue(currMsg.id);
                    }).catch(function (err) {
                    });
                };
                for (var i = 0; i < data.res.rows.length; i++) {
                    _loop_1(i);
                }
            }
        }, function (error) {
            self.logProvid.log(error);
        });
    };
    MediatorProvider.prototype.onOffline = function () {
        this.unsubscribeRefs();
    };
    MediatorProvider.prototype.unsubscribeRefs = function () {
        if (this.userMessagesRef) {
            this.userMessagesRef.off();
        }
    };
    MediatorProvider.prototype.removeChate = function (chat) {
        this.backProvid.removeChat(chat);
    };
    MediatorProvider.prototype.removeMessage = function () {
    };
    MediatorProvider.prototype.messageRecieved = function (message, senderUser) {
        //save message to local db
        this.saveRecievedMessages(message, senderUser);
        this.pushNotification('New message received!' + message.body);
    };
    MediatorProvider.prototype.saveRecievedMessages = function (message, senderUser) {
        var _this = this;
        this.logProvid.log('');
        var self = this;
        this.backProvid.getChat(message.from, message.to).then(function (data) {
            if (data.res.rows.length > 0) {
                var item = data.res.rows.item(0);
                var chat = {
                    id: item.id,
                    uid: item.uid,
                    uid2: item.uid2,
                    datetime: item.datetime,
                    lastMsgText: message.body,
                    lastMsgDate: message.datetime,
                    recieverName: senderUser.username,
                    recieverPhoto: senderUser.photo,
                    notify: item.notify
                };
                _this.logProvid.log('NOTI::Chat already exist!');
                //Update chat with the new info { lastMsg, lastMsgDate & ( recieverName & photo ) }
                self.backProvid.updateChat(chat).then(function (data) {
                    //After updating local db with new message publish event to update view in chat page and/or conversation page
                    self.events.publish(GlobalStatictVar.NEW_MESSAGE_EVENT, message, senderUser);
                    _this.logProvid.log('NOTI::NEW_MESSAGE_EVENT!');
                    //After being sure the new message arrived & saved in local db now I can update message status online to (READ)
                    self.onlineProv.updateMessageStatus(message.onlineKey, message, GlobalStatictVar.MSG_STATUS_READ);
                });
            }
            else {
                //Add new chat IF this is the first message between those two users
                var chat = {
                    uid: message.to,
                    uid2: message.from,
                    datetime: new Date().getTime(),
                    lastMsgText: message.body,
                    lastMsgDate: message.datetime,
                    recieverName: senderUser.username,
                    recieverPhoto: senderUser.photo,
                    notify: 0
                };
                self.backProvid.addChat(chat).then(function (data) {
                    self.logProvid.log('NOTI::New chat added! ');
                    //After updating local db with new message publish event to update view in chat page and/or conversation page
                    self.events.publish(GlobalStatictVar.NEW_MESSAGE_EVENT, message, senderUser);
                    //After being sure the new message arrived & saved in local db now I can update message status online to (READ)
                    self.onlineProv.updateMessageStatus(message.onlineKey, message, GlobalStatictVar.MSG_STATUS_READ);
                });
            } //END else
            self.backProvid.addMessage(message);
            self.backProvid.addChatUser(senderUser);
        }, function (error) {
            self.logProvid.log(error);
        });
    };
    //When user came online 
    MediatorProvider.prototype.getUnreadMessages = function () {
        var self = this;
        this.userMessagesRef = this.onlineProv.getUserMessagesRef(this.loggedinUser.uid);
        this.userMessagesRef.on('value', function (snapshots) {
            snapshots.forEach(function (childSnapshot) {
                var childKey = childSnapshot.key;
                var userData = childSnapshot.val();
                var messagesRef = self.onlineProv.getUnReadMessagesRef(self.loggedinUser.uid, userData.uid);
                messagesRef.once('value').then(function (snapshot) {
                    snapshot.forEach(function (childSnapshot) {
                        var childKey = childSnapshot.key;
                        var msgData = childSnapshot.val();
                        self.logProvid.log('eleM: ' + childKey);
                        self.logProvid.log('eleM: ' + msgData.body);
                        var msg = {
                            uid: msgData.uid,
                            from: msgData.from,
                            to: msgData.to,
                            onlineKey: childKey,
                            body: msgData.body,
                            type: msgData.type,
                            datetime: msgData.datetime,
                            status: msgData.status,
                            sentstatus: msgData.sentstatus
                        };
                        self.onlineProv.updateMessageStatus(msg.onlineKey, msg, GlobalStatictVar.MSG_STATUS_READ);
                        var userRef = self.onlineProv.getUser(userData.uid);
                        userRef.once('value').then(function (snapshot) {
                            var value = snapshot.val();
                            var senderUser = {
                                uid: value.uid,
                                username: value.username,
                                email: value.email,
                                photo: value.photo
                            };
                            self.logProvid.log('msg published');
                            self.events.publish(GlobalStatictVar.NEW_MESSAGE_EVENT, msg, senderUser);
                        }, function (error) {
                            self.logProvid.log('erro: ' + error);
                        });
                    });
                });
                messagesRef.off();
            });
        });
        this.userMessagesRef.off();
        //when finish getting unread messages call for new messages subscribe
        self.subscribeToMessages();
    };
    MediatorProvider.prototype.pushNotification = function (msg) {
        this.logProvid.log('Notification pushed: ' + msg);
        this.toastCtrl.create({
            message: msg,
            duration: 3000,
            position: 'top'
        });
    };
    //Testing methof
    MediatorProvider.prototype.removeAllChats = function () {
        this.backProvid.removeAllChats();
    };
    MediatorProvider.prototype.onOnlineUser = function (loggedinUser) {
        if (!this.loggedinUser) {
            this.logProvid.log('re init loggedinUser as local db corrupted');
            //This pice of code will never be excuted unless the local db corrupted and there the current db is empty
            this.loggedinUser = loggedinUser;
            this.backProvid.addUser(this.loggedinUser);
            this.onOnline();
        }
    };
    return MediatorProvider;
}());
MediatorProvider = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [BackendProvider, OnlineProvider, Events, ToastController, LogProvider])
], MediatorProvider);
export { MediatorProvider };
//# sourceMappingURL=mediatorProvider.js.map