import { Component, NgZone} from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';
import * as moment from 'moment';
import { NewEventPage } from '../modal/new-event/new-event';
import { EventDetailPage } from '../modal/event-detail/event-detail';
import { AngularFireDatabase } from 'angularfire2/database';
import { EventProvider } from '../../providers/eventProvider'


@Component({
  selector: 'page-evenement',
  templateUrl: 'evenement.html',
})
export class EvenementPage {
	eventSource :any= [];
  //eventDisplay: TemplateRef<IMonthViewDisplayEventTemplateContext>
	viewTitle: string;
	selectedDay = new Date();
	calendar= {
		mode: 'month',
		currentDate: new Date()
	};
  startingDayWeek = 1;
  loggedUser:any;

  constructor(public zone:NgZone,public eventProvider:EventProvider, public fdb:AngularFireDatabase, public modalCtrl: ModalController, public navCtrl: NavController, public navParams: NavParams) {
      this.eventSource = [] ;
   
    this.loggedUser = this.eventProvider.getCurrentUser();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EvenementPage');
    this.initEvent();

  }

  initEvent(){
        this.eventProvider.getEvents().subscribe(data =>{
        this.eventSource = [] ;
        let events = [];
        let self =this;
        console.log('data', data);
         data.forEach((ev)=>{
           let event =ev;
           event.startTime = new Date(ev.startTime);
           event.endTime = new Date(ev.endTime);
          let userRef= this.eventProvider.getUser(ev.uid);
           userRef.once('value').then(function (snapshot) {
           //let user = result['userData'];
          // user.uid = user.id;
           //user.photo= user.profile_image;
           let user =snapshot.val();
           user.displayName = user.firstName+" "+user.lastName;
           event.user=user;
           events.push(event);

           self.zone.run(()=>{
            self.eventSource.push(event);
           })
         console.log(self.eventSource)
         });
       });
    
    });
  }
  addEvent(){
    let modal = this.modalCtrl.create(NewEventPage, {selectedDay: this.selectedDay});
    modal.present();
    modal.onDidDismiss(data =>{
      if (data) {
        let eventData = data;
        this.eventProvider.addEvent(eventData);

        
  		}
  	});
  }

  onViewTitleChanged(title:string){
  	this.viewTitle = title.toUpperCase();
  }
  onEventSelected(event){
  	let start = moment(event.startTime).format('LLLL');
  	let end = moment(event.endTime).format('LLLL');
    console.log(start)
    console.log("Dans eve", event);
    
     let modal = this.modalCtrl.create(EventDetailPage, event);
    modal.present();
    modal.onDidDismiss(data =>{
      
    });

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
