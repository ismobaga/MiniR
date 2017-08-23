import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service/auth-service';
import { LoginPage } from '../login/login';

/**
 * Generated class for the ResetpasswordPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-resetpassword',
  templateUrl: 'resetpassword.html',
})
export class ResetPasswordPage {
	email:string;
  constructor(public alertCtrl: AlertController, public authService:AuthService, public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ResetpasswordPage');
  }
  reset(){
  	let alert = this.alertCtrl.create({
  		buttons: ['OK']
  	});
  	this.authService.resetPassword(this.email).then((res:any) =>{
  		if(res.success){
  			alert.setTitle('Email Envoyé');
  			alert.setSubTitle('Veillez suivre lees instruction dans l\'email');
  		}
  		else{
  			alert.setTitle('Echec');
  		}
  			
  	});
  }

  goback(){
  	this.navCtrl.setRoot(LoginPage);
  }
  		

}
