import { Injectable } from '@angular/core';
import { BackendProvider } from '../providers/backendProvider';
import { OnlineProvider } from '../providers/onlineProvider';
import { LogProvider } from '../providers/logProvider';
import { User, GlobalStatictVar, Chat, Message } from '../shared/interfaces';
import { Events, ToastController } from 'ionic-angular';




@Injectable()
export class MediatorProvider {

    loggedinUser: User;
    onlineStatus: boolean;
    userMessagesRef: any;

    constructor(public backProvid: BackendProvider, public onlineProv: OnlineProvider, public events: Events, public toastCtrl: ToastController, public logProvid: LogProvider) {
        this.logProvid.log('init Mediator provider');
    }

    initLocaleDB() {
        this.initMediator();
    }

    initMediator() {
        this.onlineProv.initConnectionStatus();
        this.initLogedinUser();

        this.events.subscribe(GlobalStatictVar.ONLINE_EVENT, () => {
            this.logProvid.log('App online');
            this.onlineStatus = true;
            this.onOnline();
        });

        this.events.subscribe(GlobalStatictVar.OFFLINE_EVENT, () => {
            this.logProvid.log('App offline');
            this.onlineStatus = false;
            this.onOffline();
        });

        this.events.subscribe(GlobalStatictVar.ONLINE_USER_EVENT, (loggedinUser) => {
            this.onOnlineUser(loggedinUser);
        });

    }
    getChatsOnline(){
        //this.onlineProv.getUserMessagesRef(this.loggedinUser.uid);
    }
    subscribeToMessages() {
        var self = this;
        this.userMessagesRef = this.onlineProv.getUserMessagesRef(this.loggedinUser.uid);
        this.userMessagesRef.on('child_changed', function (element) {
            let senderUID = element.key;
            self.logProvid.log('senderID: ' + senderUID);
            self.onlineProv.getUnReadMessagesRef(self.loggedinUser.uid, senderUID).once('value').then(function (snapshot) {

                snapshot.forEach(function (childSnapshot) {
                    var childKey = childSnapshot.key;
                    var msgData = childSnapshot.val();

                    self.logProvid.log('eleM: ' + childKey);
                    self.logProvid.log('eleM: ' + msgData.body);
                    let msg = {
                        uid: msgData.uid,
                        from: msgData.from,
                        to: msgData.to,
                        onlineKey: childKey,
                        body: msgData.body,
                        type: msgData.type,
                        datetime: msgData.datetime,
                        status: msgData.status,
                        sentstatus: msgData.sentstatus
                    }

                    self.logProvid.log("msg arrived from: " + msg.from);
                    self.logProvid.log("msg arrived to: " + msg.to);

                    //updating the sender info { now what I do care for is sender photo }
                    let userRef = self.onlineProv.getUser(senderUID);
                        userRef.once('value').then(function (snapshot) {
                        let value = snapshot.val();
                        let senderUser = {
                            uid: value.uid,
                            displayName: value.firstName+" "+value.lastName,
                            firstName:value.firstName,
                            lastName: value.lastName,
                            email: value.email,
                            photoURL: value.photoURL
                        };
                        console.log('sender', senderUser)
        // localStorage.removeItem('userData');
                    // userRef = result['userData'];
                    // //userRef.once('value').then(function (snapshot) {
                    //   //  let value = snapshot.val();
                    //     let senderUser = {
                    //         uid: userRef.id,
                    //         displayName: userRef.username,
                    //         email: userRef.email,
                    //         photoURL: userRef.profile_image
                    //     }
                        self.logProvid.log('MediatorProvider msg published');
                        self.messageRecieved(msg, senderUser);
      }, (err) => {
     });;
                    }
                );
                self.logProvid.log('end messageRef for!');
            }, (err) =>{
      self.logProvid.log('error getting chat: ' + err);});
        });
    }

    initLogedinUser() {
        var self = this;
        let userRef = this.onlineProv.getUserDetails()
          .then(function (snapshot:any) {
                        let user = snapshot;
                        
                   
                    //user.displayName=user.firstName+" "+user.lastName,
           
                self.loggedinUser = user;
                self.backProvid.initUser();
                self.logProvid.log('loggedinUser: ' + self.loggedinUser);
            
        }, (error) => {
            self.logProvid.log('get user error: ' + error);
        });
    }

    createUser(user: User) {
        return this.onlineProv.createAccount(user);
    }

    login(user: User) {
        return this.onlineProv.login(user);
    }
    logout() {
        this.onlineProv.logout();
        this.backProvid.cleanupDB();
    }


    saveRegisteredUser(newUser: User) {
        var self = this;
                    this.loggedinUser = JSON.parse(localStorage.getItem('userData'));;
                    self.backProvid.user = self.loggedinUser;
                    self.subscribeToMessages();
        self.backProvid.addUser(newUser).then(() => {
            // self.backProvid.getUser().then((data) => {
                // if (data.res.rows.length > 0) {
                //     let item = data.res.rows.item(0);
                //     let user = {
                //         id: item.id,
                //         uid: item.uid,
                //         username: item.email,
                //         email: item.email,
                //         displayName:item.firstName+" "+item.lastName,
                //         firstName: item.firstName,
                //         lastName: item.lastName,
                //         photoURL: item.photoURL
                //     }
                    //self.onlineProv.updateUser(user);//Update user info on online db in /Users/ references & user profile ( auth user )
                // }
            // }, (error) => {
                // self.logProvid.log('get user error: ' + error);
            // self.logProvid.log('Insert user error: ' + error.message);
            // });
        }, (error) => {
            self.logProvid.log('User inserted');
        });
    }

    saveLoggedinUser(newUser: User) {
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
                        self.loggedinUser = JSON.parse(localStorage.getItem('userData'));
                        self.backProvid.user = JSON.parse(localStorage.getItem('userData'));
                        self.subscribeToMessages();
            self.backProvid.addUser(newUser).then(() => {
                // self.backProvid.getUser().then((data) => {
                    // if (data.res.rows.length > 0) {
                    //     let item = data.res.rows.item(0);
                    //     let user = {
                    //         id: item.id,
                    //         uid: item.uid,
                    //         username: item.email,
                    //         email: item.email,
              /*      //     }
                    }
                }, (error) => {
                    self.logProvid.log('get user error: ' + error);
                });
                self.logProvid.log('User inserted');*/
                    //         displayName:item.firstName+" "+item.lastName,
                    //         firstName: item.firstName,
                    //         lastName: item.lastName,
                    //         photoURL: item.photoURL
            }, (error) => {
                self.logProvid.log('Insert user error: ' + error.message);
            });
      
    }

    updateUserPhoto(newUser: User) {
        //Update user photo on both { online , local }
        var self = this;
        this.backProvid.getUser().then((data) => {
            if (data.res.rows.length > 0) {
                let item = data.res.rows.item(0);
                let user = {
                    id: item.id,
                    uid: newUser.uid,
                    username: newUser.username,
                    email: newUser.email,
                    photoURL: newUser.photoURL,
                    displayName:item.firstName+" "+item.lastName,
                    firstName: item.firstName,
                    lastName: item.lastName,
                }
                self.loggedinUser = user;
                self.backProvid.user = user;
                self.backProvid.updateUser(user);//Update user photo on local db
                self.onlineProv.updateUser(user);//Update user photo on online db in /Users/ references & user profile ( auth user )
            }
        }, (error) => {
            self.logProvid.log(error);
        });
    }

    getChat(uid, uid2) {
        return this.backProvid.getChat(uid, uid2);
    }

    getContacts() {
        return this.backProvid.getUser();
    }

    addContact(uid, user) {
        this.backProvid.addContact(user);
        this.onlineProv.addContact(uid, user);
    }

    removeContact(contactId) {
        this.backProvid.removeContact(contactId);
    }

    updateContacts() {

    }

    getUsers() {
        return this.onlineProv.getUsers();
    }

    filterUsersByName(username) {
        return this.onlineProv.filterUsersByName(username);
    }

    getUser(uid) {
        return this.onlineProv.getUser(uid);
    }

    getChats() {
        return this.backProvid.getChats();
    }

    addChat(chat) {
        return this.backProvid.addChat(chat);
    }


    updateChat(chat) {
        this.backProvid.updateChat(chat);
    }

    addChatUser(user) {
        this.backProvid.addChatUser(user);
    }

    getChatUser(uid) {
        return this.backProvid.getChatUser(uid);
    }

    sendMessage(message) {
        this.backProvid.addMessage(message);
        return this.onlineProv.sendMessage(message);
    }

    sendMessageOnline(message) {
        this.onlineProv.sendMessage(message);
    }

    saveMessage(message) {
        this.backProvid.addMessage(message);
    }

    //get old messages from local db
    getMessages(uid, uid2) {
        return this.backProvid.getMessages(uid, uid2);
    }

    addMessageToQueue(message) {
        this.backProvid.addMessageQueue(message);
    }

    onOnline() {
        if (!this.loggedinUser) {
            return; //local db corrupted 
        }

        this.unsubscribeRefs();
        //when app goes online launch message subscription
        this.subscribeToMessages();

        var self = this;
        //Get un-sent from message queue and send it to the online db
        this.backProvid.getMessagesQueue().then((data) => {
            if (data.res.rows.length > 0) {
                for (let i = 0; i < data.res.rows.length; i++) {
                    let item = data.res.rows.item(i);
                    let currMsg = {
                        id: item.id,
                        originalMsgId: item.originalMsgId,
                        uid: item.uid,
                        from: item.fromUid,
                        to: item.toUid,
                        body: item.body,
                        type: item.msgType,
                        datetime: item.msgDate,
                        status: item.msgStatus
                    }
                    self.onlineProv.sendMessage(currMsg).then(_ => {
                        //update msg sentStatus to MSG_STATUS_SENT
                        self.backProvid.updateMessageStatusSent(currMsg.originalMsgId, GlobalStatictVar.MSG_STATUS_SENT);
                        self.logProvid.log('queued message sent');
                        //remove msg from queue after it has been sent online 
                        self.backProvid.removeMessageQueue(currMsg.id);
                    }).catch(err => {

                    });
                }
            }
        }, (error) => {
            self.logProvid.log(error);
        });
    }

    onOffline() {
        this.unsubscribeRefs();
    }

    unsubscribeRefs() {
        if (this.userMessagesRef) {
            this.userMessagesRef.off();
        }
    }
    removeChate(chat: Chat) {
        this.backProvid.removeChat(chat);
    }

    removeMessage() {

    }

    messageRecieved(message: Message, senderUser: User) {
        //save message to local db
        this.saveRecievedMessages(message, senderUser);
        this.pushNotification('New message received!' + message.body);
    }

    saveRecievedMessages(message: Message, senderUser: User) {
        this.logProvid.log('');
        var self = this;
        this.backProvid.getChat(message.from, message.to).then((data) => {
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
                    notify: item.notify
                }
                self.logProvid.log('NOTI::Chat already exist!');
                if(message.type===GlobalStatictVar.MSG_TYPE_PHOTO){
                    chat.lastMsgText='image...'
                }
                //Update chat with the new info { lastMsg, lastMsgDate & ( recieverName & photo ) }
                self.backProvid.updateChat(chat).then((data) => {

                    //After updating local db with new message publish event to update view in chat page and/or conversation page
                    self.events.publish(GlobalStatictVar.NEW_MESSAGE_EVENT, message, senderUser);
                    self.logProvid.log('NOTI::NEW_MESSAGE_EVENT!');
                    //After being sure the new message arrived & saved in local db now I can update message status online to (READ)
                    self.onlineProv.updateMessageStatus(message.onlineKey, message, GlobalStatictVar.MSG_STATUS_READ);
                });
            } else {
                //Add new chat IF this is the first message between those two users
                let chat = {
                    uid: message.to,
                    uid2: message.from,
                    datetime: new Date().getTime(),
                    lastMsgText: message.body,
                    lastMsgDate: message.datetime,
                    recieverName: senderUser.displayName,
                    recieverPhoto: senderUser.photoURL,
                    notify: 0
                }
                 if(message.type===GlobalStatictVar.MSG_TYPE_PHOTO){
                    chat.lastMsgText='image...'
                }
                self.backProvid.addChat(chat).then((data) => {
                    self.logProvid.log('NOTI::New chat added! ');
                    //After updating local db with new message publish event to update view in chat page and/or conversation page
                    self.events.publish(GlobalStatictVar.NEW_MESSAGE_EVENT, message, senderUser);
                    //After being sure the new message arrived & saved in local db now I can update message status online to (READ)
                    self.onlineProv.updateMessageStatus(message.onlineKey, message, GlobalStatictVar.MSG_STATUS_READ);
                });

            }//END else

            self.backProvid.addMessage(message);
            self.backProvid.addChatUser(senderUser);
        }, (error) => {
            self.logProvid.log(error);
        });
    }

    //When user came online 
    getUnreadMessages() {
        var self = this;
        this.userMessagesRef = this.onlineProv.getUserMessagesRef(this.loggedinUser.uid);
        this.userMessagesRef.on('value', function (snapshots) {
            snapshots.forEach(function (childSnapshot) {
                var childKey = childSnapshot.key;
                var userData = childSnapshot.val();

                let messagesRef = self.onlineProv.getUnReadMessagesRef(self.loggedinUser.uid, userData.uid);
                messagesRef.once('value').then(function (snapshot) {

                    snapshot.forEach(function (childSnapshot) {
                        var childKey = childSnapshot.key;
                        var msgData = childSnapshot.val();

                        self.logProvid.log('eleM: ' + childKey);
                        self.logProvid.log('eleM: ' + msgData.body);
                        let msg = {
                            uid: msgData.uid,
                            from: msgData.from,
                            to: msgData.to,
                            onlineKey: childKey,
                            body: msgData.body,
                            type: msgData.type,
                            datetime: msgData.datetime,
                            status: msgData.status,
                            sentstatus: msgData.sentstatus
                        }

                        self.onlineProv.updateMessageStatus(msg.onlineKey, msg, GlobalStatictVar.MSG_STATUS_READ);

                        let userRef = self.onlineProv.getUser(userData.uid);
                         //let userRef;
                         userRef.once('value').then(function (snapshot) {
                        let senderUser=snapshot.val();
                        senderUser.displayName = senderUser.firstName+" "+ senderUser.lastName;
                    //self.onlineProv.getUser(userData.uid).then((result) => {
        // localStorage.removeItem('userData');
                    //userRef = result['userData'];
                    //userRef.once('value').then(function (snapshot) {
                      //  let value = snapshot.val();
                  /*      let senderUser = {
                            uid: userRef.id,
                            username: userRef.username,
                            email: userRef.email,
                            photo: userRef.profile_image
                        }*/
                        // userRef.once('value').then(function (snapshot) {
                            // let value = snapshot.val();
                            // let senderUser = {
                                // uid: value.uid,
                                // username: value.username,
                                // email: value.email,
                                // photo: value.photo
                            self.logProvid.log('msg published');
                            self.events.publish(GlobalStatictVar.NEW_MESSAGE_EVENT, msg, senderUser);
                            });

                        }, (error) => {
                            self.logProvid.log('erro: ' + error);
                        //});
                    });
                });

                messagesRef.off();

            });
        });

        this.userMessagesRef.off();
        //when finish getting unread messages call for new messages subscribe
        self.subscribeToMessages();
    }

    pushNotification(msg) {
        this.logProvid.log('Notification pushed: ' + msg);
        this.toastCtrl.create({
            message: msg,
            duration: 3000,
            position: 'top'
        });
    }

    //Testing methof
    removeAllChats() {
        this.backProvid.removeAllChats();
    }

    onOnlineUser(loggedinUser) {
        if (!this.loggedinUser) {
            this.logProvid.log('re init loggedinUser as local db corrupted');
            //This pice of code will never be excuted unless the local db corrupted and there the current db is empty
            this.loggedinUser = loggedinUser
            this.backProvid.addUser(this.loggedinUser);
            this.onOnline();
        }
    }
}