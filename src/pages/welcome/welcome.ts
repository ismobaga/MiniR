import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';
import { SignupPage } from '../signup/signup';

import { AuthService } from '../../providers/auth-service/auth-service';


/**
 * Generated class for the WelcomePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-welcome',
  templateUrl: 'welcome.html',
})
export class WelcomePage {
  responseData : any;
  userData = {"email": "","password": ""};

  constructor(public navCtrl: NavController, public navParams: NavParams, public authService:AuthService) {
  }



  signUp(){
      this.navCtrl.push(SignupPage);
    }
  login(){    
      this.authService.postData(this.userData,'login').then((result) => {
      this.responseData = result;
      console.log(this.responseData);
      localStorage.setItem('userData', JSON.stringify(this.responseData));
      this.navCtrl.push(TabsPage);
    }, (err) => {
      // Error log
    });

  }
  forgotPwd(){
  	
  }

}
