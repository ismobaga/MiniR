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
  event = {startTime: new Date().toISOString(), endTime: new Date().toISOString(), allDay: false, description:''};
  minDate= new Date().toISOString();

  constructor(
  	public navCtrl: NavController,
  	public navParams: NavParams,
  	public viewCtrl: ViewController,
    public loadingCtrl: LoadingController
    ) {
    let preselectedDate = moment(this.navParams.get('selectedDay')).format();
    this.event.startTime = preselectedDate;
    this.event.endTime = preselectedDate;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EditNamePage');
  }

    save() {
    this.viewCtrl.dismiss(this.event)
  }

  dismiss() {
   this.viewCtrl.dismiss();
  }

}
