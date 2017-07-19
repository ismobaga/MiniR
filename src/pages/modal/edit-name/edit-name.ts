import { Component } from '@angular/core';
import { ViewController, LoadingController, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the EditNamePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-edit-name',
  templateUrl: 'edit-name.html',
})
export class EditNamePage {
	public user = {
		firstName: "Ismail",
		lastName: "Bagayoko"
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

    updateProfileName() {
    let loader = this.loadingCtrl.create({
      duration: 200
    });
    loader.present().then( () => this.navCtrl.pop() ); // Get back to profile page. You should do that after you got data from API
  }

  dismiss() {
   this.viewCtrl.dismiss();
  }

}
