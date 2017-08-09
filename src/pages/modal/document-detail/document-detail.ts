import { Component } from '@angular/core';
import {  ViewController, LoadingController, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the EditNamePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-document-detail',
  templateUrl: 'document-detail.html',
})
export class DocumentDetailPage {
	public user = {
		annee: "2e Annee"
	};

  constructor(
  	public navCtrl: NavController,
  	public navParams: NavParams,
  	public viewCtrl: ViewController,
    public loadingCtrl: LoadingController
    ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EditNamePage');
  }

    updateProfileAnnee() {
    
  }

  dismiss() {
   this.viewCtrl.dismiss();
  }

}
