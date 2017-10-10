import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service/auth-service';
import { UserCred } from '../../shared/interfaces';
import { TabsPage } from '../tabs/tabs';
import { SignupPage } from '../signup/signup';
import { ResetPasswordPage } from '../resetpassword/resetpassword';
/**
 * Generated class for the LoginPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
	userCred= {} as UserCred;
	constructor(public authService:AuthService, public navCtrl: NavController, public navParams: NavParams) {
  	}

  	ionViewDidLoad() {
    	console.log('ionViewDidLoad LoginPage');
  	}
  	login(){
  		this.authService.login(this.userCred).then((res:any)=>{
  			if(!res.code)
  				this.navCtrl.setRoot(TabsPage);
        else
          
  			alert(res);
  		});
 	 }

 	signup(){
 		this.navCtrl.push(SignupPage);
  	}
  	resetPassword(){
  		this.navCtrl.push(ResetPasswordPage);
  	}

}
