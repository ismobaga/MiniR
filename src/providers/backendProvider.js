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
import { SqlStorage } from '../shared/SqlStorage';
var BackendProvider = (function () {
    function BackendProvider(sqlStorage) {
        this.sqlStorage = sqlStorage;
        //For browser test
        this.storage = sqlStorage;
        this.initBackend();
    }
    BackendProvider.prototype.initBackend = function () {
        this.storage.executeSql("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, uid TEXT, username TEXT, email TEXT, photo TEXT)", []);
        this.storage.executeSql("CREATE TABLE IF NOT EXISTS messages (id INTEGER PRIMARY KEY AUTOINCREMENT, uid, onlineKey TEXT, fromUid TEXT , toUid TEXT, body TEXT, msgType TEXT, msgDate Integer, msgStatus Integer, sentStatus Integer)", []);
        this.storage.executeSql("CREATE TABLE IF NOT EXISTS chats (id INTEGER PRIMARY KEY AUTOINCREMENT, uid TEXT, uid2 TEXT, datetime Integer,lastMsgText TEXT, lastMsgDate Integer, recieverName TEXT, recieverPhoto TEXT, notify Integer )", []);
        this.storage.executeSql("CREATE TABLE IF NOT EXISTS contacts (id INTEGER PRIMARY KEY AUTOINCREMENT, uid TEXT, username TEXT, email TEXT, photo TEXT )", []);
        this.storage.executeSql("CREATE TABLE IF NOT EXISTS msg_queue (id INTEGER PRIMARY KEY AUTOINCREMENT, originalMsgId, uid, onlineKey TEXT, fromUid TEXT, toUid TEXT, body TEXT, msgType TEXT, msgDate Integer, msgStatus Integer, sentStatus Integer )", []);
        this.storage.executeSql("CREATE TABLE IF NOT EXISTS chat_users (id INTEGER PRIMARY KEY AUTOINCREMENT,  uid TEXT, username TEXT, email TEXT, photo TEXT)", []);
        this.initUser();
        console.log('initiation storage complete ');
    };
    BackendProvider.prototype.initUser = function () {
        var self = this;
        this.getUser().then(function (data) {
            if (data.res.rows.length > 0) {
                for (var i = 0; i < data.res.rows.length; i++) {
                    var item = data.res.rows.item(i);
                    var user = {
                        id: item.id,
                        uid: item.uid,
                        username: item.username,
                        email: item.email,
                        photo: item.photo
                    };
                    self.user = user;
                }
            }
        }, function (error) {
            console.log('get user error: ' + error);
        });
    };
    BackendProvider.prototype.saveUser = function (user) {
        return this.storage.executeSql("SELECT * FROM users");
    };
    BackendProvider.prototype.updateUser = function (user) {
        var query = 'UPDATE Users SET username = ? , email = ?, photo = ? WHERE id = ?';
        return this.storage.executeSql(query, [user.username, user.email, user.photo, user.id]);
    };
    BackendProvider.prototype.addUser = function (user) {
        this.user = user;
        var query = 'INSERT INTO Users (uid, username, email, photo ) VALUES (?,?,?,?)';
        return this.storage.executeSql(query, [user.uid, user.username, user.email, user.photo]);
    };
    BackendProvider.prototype.addMessage = function (message) {
        console.log('saving msg : ');
        var query = 'INSERT INTO Messages (uid, onlineKey, fromUid, toUid, body, msgType, msgDate, msgStatus, sentStatus) VALUES (?,?,?,?,?,?,?,?,?)';
        this.storage.executeSql(query, [message.uid, message.onlineKey, message.from, message.to, message.body, message.type, message.datetime, message.status, message.sentstatus]);
    };
    //onlinekey uses when updating from online to locale so we don't have to retrive the whole messages by using combination of AngularFirebase query 
    //orderByKey and startAt {onlineKey}
    BackendProvider.prototype.updateMessageOnlinekey = function (onlineKey, id) {
        var query = 'UPDATE messages SET onlineKey = ? WHERE id = ?';
        this.storage.executeSql(query, [onlineKey, id]);
    };
    BackendProvider.prototype.updateMessageStatusSent = function (id, sentstatus) {
        var query = 'UPDATE messages SET sentStatus = ? WHERE id = ?';
        this.storage.executeSql(query, [sentstatus, id]);
    };
    BackendProvider.prototype.removeMessage = function (messageId) {
        var query = 'DELETE FROM Messages WHERE id = ?';
        this.storage.executeSql(query, [messageId]);
    };
    BackendProvider.prototype.addChat = function (chat) {
        var query = 'INSERT INTO Chats (uid, uid2, datetime, lastMsgText, lastMsgDate, recieverName, recieverPhoto, notify) VALUES (?,?,?,?,?,?,?,?)';
        return this.storage.executeSql(query, [chat.uid, chat.uid2, chat.datetime, chat.lastMsgText, chat.lastMsgDate, chat.recieverName, chat.recieverPhoto, chat.notify]);
    };
    //This is the user which you chat with him/her but not added to contact
    BackendProvider.prototype.addChatUser = function (user) {
        var self = this;
        //To be sure there is no duplicat chat for single user
        var query0 = 'SELECT * FROM chat_users WHERE  uid = ? ORDER BY id DESC LIMIT 1';
        this.storage.executeSql(query0, [user.uid]).then(function (data) {
            if (data.res.rows.length > 0) {
                var item = data.res.rows.item(0);
                var query = 'UPDATE chat_users SET username = ?, email = ?, photo = ? WHERE id = ?';
                self.storage.executeSql(query, [user.username, user.email, user.photo, item.id]);
            }
            else {
                var query = 'INSERT INTO chat_users (uid, username, email, photo ) VALUES (?,?,?,?)';
                self.storage.executeSql(query, [user.uid, user.username, user.email, user.photo]);
            }
        }, function (error) {
            console.log(error);
        });
    };
    BackendProvider.prototype.updateChat = function (chat) {
        console.log('update chat notify: ' + chat.notify);
        var query = 'UPDATE chats SET datetime = ?, lastMsgText = ?, lastMsgDate = ?, recieverPhoto = ?, notify = ? WHERE id = ?';
        return this.storage.executeSql(query, [chat.datetime, chat.lastMsgText, chat.lastMsgDate, chat.recieverPhoto, chat.notify, chat.id]);
    };
    BackendProvider.prototype.removeChat = function (chat) {
        var query = 'DELETE FROM chats WHERE id = ?';
        this.storage.executeSql(query, [chat.id]);
        //Delete user object which connected to this chat
        var query2 = 'DELETE FROM chat_users WHERE uid = ?';
        this.storage.executeSql(query2, [chat.uid2]);
        //Delete messages which connected to this chat
        var query3 = 'DELETE FROM Messages WHERE ( fromUid = ? AND toUid = ? ) OR ( fromUid = ? AND toUid = ? )';
        this.storage.executeSql(query3, [chat.uid, chat.uid2, chat.uid2, chat.uid]);
    };
    //Testing method
    BackendProvider.prototype.removeAllChats = function () {
        var query = 'DELETE FROM chats';
        this.storage.executeSql(query);
        var query2 = 'DELETE FROM chat_users';
        this.storage.executeSql(query2);
        var query3 = 'DELETE FROM Messages';
        this.storage.executeSql(query3);
    };
    //There won't be two users for the same chat ofcourse but using uid & limit is just for being sure
    BackendProvider.prototype.getChatUser = function (uid) {
        var query = 'SELECT * FROM chat_users WHERE uid = ? ORDER BY id DESC LIMIT 1;';
        return this.storage.executeSql(query, [uid]);
    };
    BackendProvider.prototype.getUser = function () {
        return this.storage.executeSql("SELECT * FROM users");
    };
    BackendProvider.prototype.getContacts = function () {
        return this.storage.executeSql("SELECT * FROM contacts");
    };
    BackendProvider.prototype.addContact = function (user) {
        var query = 'INSERT INTO contacts (uid, username, email, photo ) VALUES (?,?,?,?)';
        return this.storage.executeSql(query, [user.uid, user.username, user.email, user.photo]);
    };
    BackendProvider.prototype.removeContact = function (contactId) {
        var query3 = 'DELETE FROM contacts WHERE id = ?';
        this.storage.executeSql(query3, [contactId]);
    };
    BackendProvider.prototype.getMessages = function (uid, uid2) {
        //Get messages sent/recieved between me (uid) and the other user (uid2) 
        var query = 'SELECT * FROM Messages WHERE ( fromUid = ? AND toUid = ? ) OR ( fromUid = ? AND toUid = ? )';
        return this.storage.executeSql(query, [uid, uid2, uid2, uid]);
    };
    BackendProvider.prototype.getChats = function () {
        var query = 'SELECT * FROM chats ORDER BY datetime ASC';
        return this.storage.executeSql(query);
    };
    //There is only one chat object between two users { using limit just in case }
    BackendProvider.prototype.getChat = function (uid, uid2) {
        var query = 'SELECT * FROM chats WHERE ( uid = ? AND uid2 = ? ) OR ( uid = ? AND uid2 = ? ) LIMIT 1;';
        return this.storage.executeSql(query, [uid, uid2, uid2, uid]);
    };
    BackendProvider.prototype.addMessageQueue = function (message) {
        var query = 'INSERT INTO msg_queue ( originalMsgId, uid, onlineKey, fromUid, toUid, body, msgType, msgDate, msgStatus,sentStatus) VALUES (?,?,?,?,?,?,?,?,?,?)';
        this.storage.executeSql(query, [message.originalMsgId, message.uid, message.onlineKey, message.from, message.to, message.body, message.type, message.datetime, message.status, message.sentstatus]);
    };
    BackendProvider.prototype.removeMessageQueue = function (messageId) {
        var query = 'DELETE FROM msg_queue WHERE id = ?';
        this.storage.executeSql(query, [messageId]);
    };
    BackendProvider.prototype.getMessagesQueue = function () {
        var query = 'SELECT * FROM msg_queue';
        return this.storage.executeSql(query);
    };
    return BackendProvider;
}());
BackendProvider = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [SqlStorage])
], BackendProvider);
export { BackendProvider };
//# sourceMappingURL=backendProvider.js.map