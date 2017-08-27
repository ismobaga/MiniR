import { Component } from '@angular/core';
import { ModalController, ViewController, LoadingController, NavController, NavParams, ActionSheetController  } from 'ionic-angular';
import { QRCodePage } from '../qr-code/qr-code';
import DarkSkyApi from 'dark-sky-api';
import * as moment from 'moment';
import { AuthService } from '../../../providers/auth-service/auth-service';
import { NewEventPage } from '../new-event/new-event';
import { EventProvider } from '../../../providers/eventProvider'


DarkSkyApi.apiKey = '62301ba15765fd4b14620c0253918cfc';
DarkSkyApi.units = 'si'; // default 'us'
DarkSkyApi.language = 'fr'; // default 'en'
DarkSkyApi.postProcessor = (item) => { // default null;
  item.day = item.dateTime.format('ddd');
  return item;
}

const position = {
  latitude: 46.105342, 
  longitude: -64.788694
};


@Component({
  selector: 'page-event-detail',
  templateUrl: 'event-detail.html',
})
export class EventDetailPage {
  event:any;
  meteo: any;
  meteoIcon: Promise<string>|null = null;
  meteoTemperature: Promise<number>|null = null;
  uid:Promise<string>| null = null;
  can:boolean = false;
  constructor(
    public authService: AuthService,
    public eventProvider:EventProvider,
  	public navCtrl: NavController,
  	public navParams: NavParams,
  	public viewCtrl: ViewController,
    public loadingCtrl: LoadingController,
    public modalCtrl: ModalController,
    public actionSheetCtrl: ActionSheetController
    ) {
    this.event = navParams.data;
    this.loadMeteo();
    let self = this;
    this.can = self.event.uid== this.authService.getUserLocal().uid ? true:false;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EditNamePage');
  }

    updateProfileAnnee() {
    
  }
  loadMeteo(){
    console.log(this.event);

    let time = moment(this.event.startTime).format();
    console.log(time);
    
    console.log(moment(this.event.startTime).format('LLL'))
    DarkSkyApi.loadTime(time, position)
              .then((result:any) => {
                   console.log(result);
                   this.meteo = result.currently;
                   this.meteoIcon = new Promise<string>((resolve, reject) => {  resolve(this.getIcon(result.currently.icon)); });
                   this.meteoTemperature =new Promise<number>((resolve, reject) => {  resolve(Math.round(result.currently.apparentTemperature)); }); 
                   
              });
  }
  getEventDate(){
    moment.locale('fr');
      let start = moment(this.event.startTime);
      let end = moment(this.event.endTime);
      if(start.isSame(end, 'day')){
        if(this.event.allDay){
          return start.format('dddd Do MMM');
        }
        else{
          let temp:string = start.format('dddd Do MMM') +'\n'+start.format('HH:MM')+'-'+end.format('HH:MM');
          return temp;
        }

    }
    if(this.event.allDay){
         let temp:string = start.format('dddd Do MMM')+'-\n'+end.format('dddd Do MMM');
         return temp;
       }
       else{
         let temp:string = start.format('dddd Do MMM à hh:mm')+'-\n'+end.format('dddd Do MMM à hh:mm');
         return temp;
       }
  }
 getIcon(icon:string):string{
   if(icon=='clear-day'){
     return 'sunny';
   }
   if(icon=='clear-night'){
     return 'moon';
   }
   if(icon=='rain'){
     return 'rainy';
   }
   if(icon=='snow'){
     return 'snow';
   }
   if(icon=='sleet'){
     return 'clood';
   }
   if(icon=='wind'){
     return 'clood';
   }
   if(icon=='fog'){
     return 'cloody';
   }
   if(icon=='cloudy'){
     return 'cloody';
   }
   if(icon=='partly-cloudy-day'){
     return 'partly-sunny';
   }
   if(icon=='partly-cloudy-night'){
     return 'cloudy-night';
   }
   if(icon=='hail'){

   return 'clood';
   }
   if(icon=='tornado'){

   return 'clood';
   }
   if(icon=='thunderstorm'){
     return 'thunderstorm';
   }

   return 'clood';

 }
 editEvent(){

    let modal = this.modalCtrl.create(NewEventPage, {event: this.event});
    modal.present();
    modal.onDidDismiss(data =>{
      if (data) {
        let eventData = data;
        let event = eventData.event;
        let key = eventData.key;
        this.eventProvider.editEvent(key, event);

        
      }
    });

 }
 deleteEvent(){
   let actionSheet = this.actionSheetCtrl.create({
 
      buttons: [
        {
          text: 'Supprimer',
          handler: () => {
              let actionSheet2 = this.actionSheetCtrl.create({
                title: "Voulez-vous vraiment supprimer cet événement ?",
                cssClass: 'action-sheets-basic-page',
                buttons: [
                {
                  text: 'Supprimer l\'événement',
                   icon:  'trash',
                  handler: () => {
                     this.eventProvider.deleteEvent(this.event.$key);
                     this.dismiss();
                  }
                },{
                  text: 'Annuler',
                  icon: 'close',
                  role: 'cancel'
                }
                ]
              });
              actionSheet2.present();
            console.log('Destructive clicked');
          }
        },{
          text: 'Annuler',
          role: 'cancel',
          handler: () => {
          }
        }
      ]
    });
    actionSheet.present();
 }
 qrCode(){
    let modal = this.modalCtrl.create(QRCodePage, {type: 'event', ref:'events', key:this.event.$key, title:this.event.title});
    modal.present();

 }
  dismiss() {
   this.viewCtrl.dismiss();
  }

}
