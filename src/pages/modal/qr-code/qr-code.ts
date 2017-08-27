import { Component, NgZone } from '@angular/core';
import { NavController, NavParams, LoadingController, ViewController } from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';



@Component({
  selector: 'page-qr-code',
  templateUrl: 'qr-code.html',

 
})
export class QRCodePage {
	imgUrl = 'https://firebasestorage.googleapis.com/v0/b/myapp-4eadd.appspot.com/o/chatterplace.png?alt=media&token=e51fa887-bfc6-48ff-87c6-e2c61976534e';
  	moveon = true;
    params:any;
    
  constructor(public viewCtrl: ViewController, public qrCode: BarcodeScanner, public zone: NgZone, public loadingCtrl:LoadingController,public navCtrl: NavController, public navParams: NavParams) {
    this.params = this.navParams.data;
    this.getQRCode();

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad QRCodePage');
  }
  getQRCode(){
    let temp :any= {};
    temp.type = this.params.type;
    temp.ref = this.params.ref;
    temp.key = this.params.key;
    temp.key = this.params.title
    let code:string = JSON.stringify(temp);
    console.log(code);
    console.log(temp);

    // let code:string = 'type:'+
    // this.params.type+',ref:'+
    // this.params.ref+',key:'+
    // this.params.key+',title:'+
    // this.params.title;
 
   return code;
  }
  updateProceed(){
  
  }

  dismiss(){
    this.viewCtrl.dismiss();
  }

}
