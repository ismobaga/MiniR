import { Component } from '@angular/core';
import { ViewController, LoadingController, NavController, NavParams } from 'ionic-angular';

import { AuthService } from '../../../providers/auth-service/auth-service';
@Component({
  selector: 'page-edit-name',
  templateUrl: 'edit-name.html',
})
export class EditNamePage {
	public name = {
		firstName: "Ismail",
		lastName: "Bagayoko"
	};

  constructor(
  	public navCtrl: NavController,
  	public navParams: NavParams,
  	public viewCtrl: ViewController,
    public loadingCtrl: LoadingController,
	private authService: AuthService
    ) {
		this.name.firstName = navParams.get('firstName');
		this.name.lastName = navParams.get('lastName');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EditNamePage');
  }

    updateProfileName() {
    let loader = this.loadingCtrl.create({
      duration: 200
    });
    loader.present();
	this.authService.editName(this.name).then((result) => {
     loader.dismiss();
		localStorage.setItem('name', JSON.stringify(this.name));
	}, (err) => {});
	this.navCtrl.pop() // Get back to profile page. You should do that after you got data from API
	}
	
  dismiss() {
   this.viewCtrl.dismiss();
  }

}
