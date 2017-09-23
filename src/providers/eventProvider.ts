import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { AngularFireDatabase } from 'angularfire2/database';
import { OnlineProvider } from './onlineProvider';


@Injectable()
export class EventProvider {
	eventSource= [];
	userDetails:any;
	constructor(public onlineProv:OnlineProvider, public afdatabase: AngularFireDatabase) {
	const data = JSON.parse(localStorage.getItem('userData'));
	this.userDetails = data;
        
    }
    getCurrentUser(){
    	return this.userDetails;
    }
    getEvents(){
    	return this.afdatabase.list('/events/');
    }
    getEvent(key){
        return this.afdatabase.database.ref('/events/').child(key);
    }
    addEvent(event){
        event.uid= this.userDetails.uid;
        this.afdatabase.list('/events/').push(event);
    }
    editEvent(key, event){
        event.uid= this.userDetails.uid;
        this.afdatabase.database.ref('/events/'+key).update(event);
    }
    getUser(uid){
        return this.onlineProv.getUser(uid);
    }
    deleteEvent(key){
    	this.afdatabase.object('/events/'+key).remove();
    }
    
}