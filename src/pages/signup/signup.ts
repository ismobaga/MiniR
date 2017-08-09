import { Component } from '@angular/core';
import { NavController, LoadingController, NavParams } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';
import { LoginPage } from '../login/login';
import { WelcomePage } from '../welcome/welcome';
import { AuthService } from '../../providers/auth-service/auth-service';
import { AngularFireAuth } from 'angularfire2/auth';
import firebase from 'firebase/app';
/**
 * Generated class for the SignupPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {

  responseData : any;
  userData = {"password": "", "first_name": "", "last_name": "","email": ""};


  constructor(public afAuth: AngularFireAuth, public loadingCtrl:LoadingController,public navCtrl: NavController, public navParams: NavParams, public authService:AuthService) {
  }

  signup(){
	   let loader = this.loadingCtrl.create({
      duration: 200
    });
    loader.present(); 
     this.authService.postData(this.userData,'user').then((result) => {
      this.responseData = result;
      //console.log(this.responseData);
	  
      localStorage.setItem('userData', JSON.stringify(this.responseData));
      let token = this.responseData.userData.fireToken;
      this.afAuth.auth.signInWithCustomToken(token).catch(function(error) {
      // Handle Errors here.
      // var errorCode = error.code;
      var errorMessage = error.message;
      // ...
      });
      this.navCtrl.push(TabsPage);
    }, (err) => {
      // Error log
      console.log(err);
    });

  }

  login(){
    //Login page link
    this.navCtrl.push(WelcomePage);
  }
}

