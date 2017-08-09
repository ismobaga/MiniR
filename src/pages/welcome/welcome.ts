import { Component } from '@angular/core';
import { NavController, LoadingController, NavParams } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';
import { SignupPage } from '../signup/signup';

import { AuthService } from '../../providers/auth-service/auth-service';
import { AngularFireAuth } from 'angularfire2/auth';
import firebase from 'firebase/app';

import { MediatorProvider } from '../../providers/mediatorProvider';

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

  constructor( public medProvid: MediatorProvider,public afAuth: AngularFireAuth, public loadingCtrl:LoadingController,public navCtrl: NavController, public navParams: NavParams, public authService:AuthService) {
    this.medProvid.initLocaleDB();
    if (JSON.parse(localStorage.getItem('userData'))) {
		 let loader = this.loadingCtrl.create({
      duration: 200
    });
    loader.present(); 
      this.navCtrl.push(TabsPage);
    }
  }



  signUp(){
      this.navCtrl.push(SignupPage);
    }
  login(){    
       let user = {
            uid: '',
            password:'',
            email: '',
            photo:'',
            username:''
        };
		  let loader = this.loadingCtrl.create({
      duration: 200
    });
    loader.present(); 
      this.authService.postData(this.userData,'login').then((result) => {
      this.responseData = result;
      this.responseData['userData']['uid']=this.responseData['userData']['id'];

      localStorage.setItem('userData', JSON.stringify(this.responseData));
      let token = this.responseData.userData.fireToken;
      this.afAuth.auth.signInWithCustomToken(token).then((data)=>{
                let userDet = this.responseData.userData;
                user.uid = userDet.id;
                user.email = userDet.email;
                user.username = userDet.username;
                user.photo = userDet.profile_image;
                this.medProvid.saveLoggedinUser(user);

                
      }).catch(function(error) {
           
      // Handle Errors here.
      var errorMessage = error.message;
      // ...
      });
      this.navCtrl.push(TabsPage);

    }, (err) => {
      // Error log
    });
	

  }
  forgotPwd(){
  	
  }

}
