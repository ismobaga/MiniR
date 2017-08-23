import { Component, NgZone } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service/auth-service';
import { ImgHandlerProvider } from '../../providers/img-handler/img-handler';
import { TabsPage } from '../tabs/tabs';

/**
 * Generated class for the ProfilePicturePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-profile-picture',
  templateUrl: 'profile-picture.html',
})
export class ProfilePicturePage {
	imgUrl = 'https://firebasestorage.googleapis.com/v0/b/myapp-4eadd.appspot.com/o/chatterplace.png?alt=media&token=e51fa887-bfc6-48ff-87c6-e2c61976534e';
  	moveon = true;
  constructor(public imgService:ImgHandlerProvider, public zone: NgZone, public authService:AuthService, public loadingCtrl:LoadingController,public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePicturePage');
  }
  chooseImage(){
  	let loader = this.loadingCtrl.create({
  		content:'Chargement...'
  	});
  	//loader.present();
  	this.imgService.uploadImage().then((uploadedUrl: any) =>{
  		loader.dismiss();
  		this.zone.run(() =>{
  			this.imgUrl = uploadedUrl;
  			this.moveon = false;
  		})
  	})
  }
  updateProceed(){
  	let loader = this.loadingCtrl.create({
  		content: 'Chargement...'
  	})
  	loader.present();
  	this.authService.updateImage(this.imgUrl).then((res:any)=>{
      loader.dismiss();
  		if(res.success){
  			this.navCtrl.setRoot(TabsPage);
  		}
  		else{
  			alert(res);
  		}
  	})
  }

  proceed(){
	this.navCtrl.setRoot(TabsPage);

  }

}
