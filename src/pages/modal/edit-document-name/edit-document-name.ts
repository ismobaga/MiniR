import { Component } from '@angular/core';
import { ViewController, LoadingController, NavController, NavParams } from 'ionic-angular';

import { AuthService } from '../../../providers/auth-service/auth-service';
@Component({
  selector: 'page-edit-document-name',
  templateUrl: 'edit-document-name.html',
})
export class EditDocumentNamePage {
	
		documentName= "";


  constructor(
  	public navCtrl: NavController,
  	public navParams: NavParams,
  	public viewCtrl: ViewController,
    public loadingCtrl: LoadingController,
	private authService: AuthService
    ) {
		this.documentName = navParams.get('docoumentName');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EditNamePage');
  }

    updateDocumentName() {
 
   this.viewCtrl.dismiss({'documentName':this.documentName, changed:true});
    // Get back to profile page. You should do that after you got data from API
  }
  
  dismiss() {
   this.viewCtrl.dismiss({changed:false});
  }

}
