import { Component } from '@angular/core';
import { NavController, LoadingController, NavParams, ToastController  } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';
import { LoginPage } from '../login/login';
import { ProfilePicturePage } from '../profile-picture/profile-picture';
import { AuthService } from '../../providers/auth-service/auth-service';
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

  newUser = {password: "", first_name: "", last_name: "",email: ""};


  constructor(public toastCtrl:ToastController, public loadingCtrl:LoadingController,public navCtrl: NavController, public navParams: NavParams, public authService:AuthService) {
  }

  signup(){
	  let toster = this.toastCtrl.create({duration:300, position:'bottom'});
    if (this.newUser.email=='' || this.newUser.password=='' || this.newUser.first_name=='' || this.newUser.last_name=='') {
      toster.setMessage('Tous les champs sont obligatoire');
      toster.present();
    }
    else if (this.newUser.password.length<6) {
      toster.setMessage('Mot de passe faible');
      toster.present();
    }
    else{
      let loader = this.loadingCtrl.create({
        content:'Chargement...'
      });
      loader.present();
      this.authService.addUser(this.newUser).then((res:any) => {
        loader.dismiss();
        if(res.success)
          this.navCtrl.push(ProfilePicturePage);
        else
          alert('Errr '+ res);
      }).catch(err=>{
        loader.dismiss();
        //gerer l'err dinscription @todo
      });
    }
  }

  goback(){
    //Login page link
    this.navCtrl.setRoot(LoginPage);
  }
}

