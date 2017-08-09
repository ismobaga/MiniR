import { Component } from '@angular/core';
import { ViewController, LoadingController, NavController, NavParams } from 'ionic-angular';

import { AuthService } from '../../../providers/auth-service/auth-service';
@Component({
  selector: 'page-edit-name',
  templateUrl: 'edit-name.html',
})
export class EditNamePage {
	public user = {
		first_name: "Ismail",
		last_name: "Bagayoko",
		user_id: "",
		token:""
	};

  constructor(
  	public navCtrl: NavController,
  	public navParams: NavParams,
  	public viewCtrl: ViewController,
    public loadingCtrl: LoadingController,
	private authService: AuthService
    ) {
		this.user.first_name = navParams.get('first_name');
		this.user.last_name = navParams.get('last_name');
		this.user.user_id = navParams.get('user_id');
		this.user.token = navParams.get('token');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EditNamePage');
  }

    updateProfileName() {
    let loader = this.loadingCtrl.create({
      duration: 200
    });
    loader.present()
	.then( () =>{
		this.authService.postData(this.user, 'user/update/name')
			.then((result) => {
				// localStorage.removeItem('userData');
				let data = JSON.parse(localStorage.getItem('userData'));
				data.userData['first_name'] = this.user.first_name;
				data.userData['last_name'] = this.user.last_name;
        
				localStorage.setItem('userData', JSON.stringify(data));
				console.log(result);
				}, (err) => {
					console.log(err);
				});
	this.navCtrl.pop()} ); // Get back to profile page. You should do that after you got data from API
	}
	
  dismiss() {
   this.viewCtrl.dismiss();
  }

}
