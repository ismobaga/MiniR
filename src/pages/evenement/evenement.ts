import { Component } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';
import * as moment from 'moment';
import { NewEventPage } from '../modal/new-event/new-event'

/**
 * Generated class for the EvenementPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-evenement',
  templateUrl: 'evenement.html',
})
export class EvenementPage {
	eventSource= [];
  //eventDisplay: TemplateRef<IMonthViewDisplayEventTemplateContext>
	viewTitle: string;
	selectedDay = new Date();
	calendar= {
		mode: 'month',
		currentDate: new Date()
	};
  startingDayWeek = 1;

  constructor(public modalCtrl: ModalController, public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EvenementPage');
  }
  addEvent(){
  	let modal = this.modalCtrl.create(NewEventPage, {selectedDay: this.selectedDay});
  	modal.present();
  	modal.onDidDismiss(data =>{
  		if (data) {
  			let eventData = data;
  			eventData.startTime = new Date(data.startTime);
  			eventData.endTime = new Date(data.endTime);
  			let events = this.eventSource;
  			events.push(eventData);
  			this.eventSource = [];
  			setTimeout(()=>{
  				this.eventSource =events;
  			});
  		}
  	});
  }

  onViewTitleChanged(title:string){
  	this.viewTitle = title.toUpperCase();
  }
  onEventSelected(event){
  	let start = moment(event.startTime).format('LLLL');
  	let end = moment(event.endTime).format('LLLL');
  }
  onTimeSelected(ev){
  	this.selectedDay= ev.selectedTime;
  }
  changeMonth(direction){
    let tempDate = this.calendar.currentDate;
    if (direction===-1) {
              setTimeout(()=>{
        this.calendar.currentDate.setMonth(tempDate.getMonth()-1);
        });
    }
    if (direction===1) {
              setTimeout(()=>{
        this.calendar.currentDate.setMonth(tempDate.getMonth()+1);
        });
    }
    console.log( this.calendar.currentDate);
  }

}
