import { Component } from '@angular/core';
import {  ViewController, LoadingController, NavController, NavParams } from 'ionic-angular';
import * as moment from 'moment';
/**
 * Generated class for the EditNamePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-new-event',
  templateUrl: 'new-event.html',
})
export class NewEventPage {
  event = {startTime: new Date().toISOString(), endTime: new Date().toISOString(), allDay: false, description:'', isPublic:true};
  minDate= new Date().toISOString();
  title: string= null;
  isEdit: boolean = false;
  constructor(
  	public navCtrl: NavController,
  	public navParams: NavParams,
  	public viewCtrl: ViewController,
    public loadingCtrl: LoadingController
    ) {
    if (this.navParams.get('event')) {
      this.event = this.navParams.get('event');
      this.event.startTime = moment(this.navParams.get('event').startTime).format();
      this.event.endTime = moment(this.navParams.get('event').endTime).format();
      this.isEdit= true;
      this.title = "Edit d'evenement";
    }
    else{
    let preselectedDate = moment(this.navParams.get('selectedDay')).format();
    this.event.startTime = preselectedDate;
    this.event.endTime = preselectedDate;
  }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EditNamePage');
  }

    save() {
    this.viewCtrl.dismiss(this.event);
  }

  edit():void{
      let temp ={event:this.event, key:this.navParams.get('event').$key}
    this.viewCtrl.dismiss(temp);
  }

  dismiss() {
   this.viewCtrl.dismiss();
  }

}
