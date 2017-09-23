export interface ValidationResult {
    [key: string]: boolean;
}

export interface User {
    id?: number;
    uid?: string;
    username?: string;
    email: string;
    displayName?:string;
    password?: string;
    firstName: string;
    lastName: string;
    photoURL?: string;
    birthdate?: number;
    isContact?: boolean;
}

export interface UserCred{
    email:string;
    password:string;
}

export interface Message {
    id?: number;
    uid: string;
    onlineKey?: string,
    from: string;
    to: string;
    body: string;
    type: number;
    datetime: number;
    status: number;
    sentstatus?: number;
}

export interface MessageQueue extends Message {
    originalMsgId: number;
}

export interface Chat {
    id?: number;
    uid: string;
    uid2: string;
    datetime: number;
    lastMsgText?: string;
    lastMsgDate?: number;
    recieverName?: string;
    recieverPhoto?: string;
    user?: User; //Temp field
    notify?: number; //1 if this chat unread yet 
}

export interface IDocument {
    text?:string, 
    name?:string, 
    extension?:string, 
    size?:string, 
    tags?:Array<Tag>,
    downloadURL?:string,
    views:number,
    merci:number,
    merciArray?:Array<string>,
    authorUid:string,
    date:string,
    fullPath?:string,
    color:string,
    hasFile:boolean
  }
export interface Tag{
     display:string,
     value: string,
     readonly?:boolean
}
export class GlobalStatictVar {

    public static MSG_STATUS_UN_READ = 0;
    public static MSG_STATUS_READ = 1;
    public static MSG_STATUS_RECEIVED = 2;

    public static MSG_STATUS_UN_SENT = 0;
    public static MSG_STATUS_SENT = 1;

    public static MSG_TYPE_MSG = 0;
    public static MSG_TYPE_PHOTO = 1;
    public static MSG_TYPE_CONTACT = 2;
    public static MSG_TYPE_FILE = 3;
    public static MSG_TYPE_LOCATION = 4;
    public static MSG_TYPE_VOICE = 5;
    public static MSG_TYPE_POST = 6 ;
    public static MSG_TYPE_EVENT = 7;

    public static DEFAULT_PROFILE_PHOTO = '../assets/image/default-profile.png';

    public static ONLINE_EVENT = 'online';
    public static OFFLINE_EVENT = 'offline';
    public static ONLINE_USER_EVENT = 'onlineUser';
    public static NEW_MESSAGE_EVENT = 'newMessage';
    public static UPDATE_CHAT_EVENT = 'updateChat';
    public static NOTIFICATION_EVENT = 'notification';

    public static DATA_TYPE_POST = 'document';
    public static DATA_TYPE_EVENT = 'event';


}