import { Component, NgZone } from '@angular/core';
import { NavController, NavParams, LoadingController, ViewController } from 'ionic-angular';



@Component({
  selector: 'page-image-viewer',
  templateUrl: 'image-viewer.html',

 
})
export class ImageViewer {
	imgUrl = 'https://firebasestorage.googleapis.com/v0/b/myapp-4eadd.appspot.com/o/chatterplace.png?alt=media&token=e51fa887-bfc6-48ff-87c6-e2c61976534e';
  	moveon = true;
    params:any;
    images:any;
    
  constructor(public viewCtrl: ViewController, public zone: NgZone, public loadingCtrl:LoadingController,public navCtrl: NavController, public navParams: NavParams) {
  	this.images = this.navParams.data.images;
    }
    

  }
