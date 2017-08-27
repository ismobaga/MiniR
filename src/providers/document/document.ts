import { Injectable } from '@angular/core';
import { ActionSheetController } from 'ionic-angular'
import 'rxjs/add/operator/map';
import firebase from 'firebase';
import { Camera } from '@ionic-native/camera';



@Injectable()
export class DocumentProvider {
fireStore = firebase.storage();
  constructor(public camera:Camera, public actionSheetCtrl:ActionSheetController) {
    console.log('Hello DocumentProvider Provider');
  }

  ask(){
  	return new Promise((resolve, reject) => {
  	let actionSheet = this.actionSheetCtrl.create({
 
      buttons: [
        {
          text: 'Choisir',
          handler: () => {
              this.storeImg(this.camera.PictureSourceType.PHOTOLIBRARY).then((res)=>{
               resolve(res);
            });
          }
        },{
          text: 'Prendre',
          handler: () => {
          	 this.storeImg(this.camera.PictureSourceType.CAMERA).then((res)=>{
                resolve(res);
 });
          }
        },{
          text: 'Importer de...',
          handler: () => {
          	// this.storeImg(this.camera.PictureSourceType.PHOTOLIBRARY).then((url)=>{
              // });
          }
        },{
          text: 'Annuler',
          role: 'cancel',
          handler: () => {
          }
        }
      ]
    });
    actionSheet.present();
     });
 }
image;
error;

storeImg(type){
        return new Promise((resolve, reject) => {
    this.camera.getPicture({
      sourceType: type,
      destinationType: this.camera.DestinationType.DATA_URL,
      quality: 100,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
    }).then(imageData => {
      this.image = 'data:image/jpeg;base64,' + imageData;
      let uuid =this.guid();
      let imageStore = this.fireStore.ref('msgpics').child(firebase.auth().currentUser.uid).child('msgpic'+uuid);
      
        imageStore.putString(this.image, 'data_url').then((res)=> {
                  resolve(res)

                }).catch((err)=>{
                  reject(err);
                })
    }, error => {
      this.error = JSON.stringify(error);
    });
        }
      );
  }
  guid(){
    function s4() {
      return Math.floor((1+ Math.random())*0x100000).toString(16).substring(1);
    }
    return s4()+s4()+'-'+ s4()+'-'+s4()+'-'+s4()+'-'+s4()+s4()+s4();
  }



  dismiss() {
   // this.viewCtrl.dismiss();
  }


}
