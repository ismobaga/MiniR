import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import firebase from 'firebase';
import {  ToastController, ActionSheetController, LoadingController  } from 'ionic-angular';
import { File, FileEntry } from '@ionic-native/file';
import { Transfer, TransferObject, FileUploadOptions } from '@ionic-native/transfer';
import { FilePath } from '@ionic-native/file-path';
import { Camera } from '@ionic-native/camera';
/*
  Generated class for the ImgHandlerProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class ImgHandlerProvider {
	nativePath:any;
	fireStore = firebase.storage();
	imageURL;
  constructor(public actionSheet: ActionSheetController, public camera: Camera, public loadingCtrl:LoadingController, public toastCtrl: ToastController) {
    console.log('Hello ImgHandlerProvider Provider');
  }

  uploadImage(){
  	let promise = new Promise((resolve, reject) =>{
  		this.presentActionSheet().then((url)=>{
  			resolve(url);
  		});
  		})
    return promise;
  }


 public presentActionSheet(){
     return new Promise((resolve, reject) => {
  	let actionSheet = this.actionSheet.create({
  		title:"La source de l'image",
  		buttons: [
	  		{
	  			text: "Choisir",
	  			handler: () => {
	  				this.selectPhoto().then((url)=>{
	  					resolve(url);
	  				});
	  			}
	  		},
	  		{
	  			text: "Camera",
	  			handler: () => {
	  			    this.takePhoto().then((url)=>{
	  			    	resolve(url);
	  			    });
	  			}
	  		},
	  		{
	  			text: "Cancel",
	  			role: "cancel"
	  		}
  		]
  	});
  	actionSheet.present();
 }
 );
  }
error:any;
image;
 takePhoto() {
     return new Promise((resolve, reject) => {
    this.camera.getPicture({
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType: this.camera.PictureSourceType.CAMERA,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
    }).then(imageData => {
      this.image = 'data:image/jpeg;base64,' + imageData;
      let imageStore = this.fireStore.ref('profileImages').child(firebase.auth().currentUser.uid);
  		    let loader = this.loadingCtrl.create({
      content:'Chargement...'
    });
    loader.present();
  			imageStore.putString(this.image, 'data_url').then((res)=> {
            loader.dismiss();
  								this.fireStore.ref('/profileImages').child(firebase.auth().currentUser.uid).getDownloadURL().then((url)=>{
  									this.imageURL=url;
  									resolve(url);
  								}).catch((err)=>{
  									reject(err);
  								})
  							}).catch((err)=>{
  								reject(err);
  							})

    }, error => {
      this.error = JSON.stringify(error);
    });
  		}
  	);
  }

  selectPhoto() {
        return new Promise((resolve, reject) => {
    this.camera.getPicture({
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      destinationType: this.camera.DestinationType.DATA_URL,
      quality: 100,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
    }).then(imageData => {
      this.image = 'data:image/jpeg;base64,' + imageData;
      let imageStore = this.fireStore.ref('profileImages').child(firebase.auth().currentUser.uid);
  		          let loader = this.loadingCtrl.create({
      content:'Chargement...'
    });
    loader.present();
  			imageStore.putString(this.image, 'data_url').then((res)=> {
          loader.dismiss();
  								this.fireStore.ref('/profileImages').child(firebase.auth().currentUser.uid).getDownloadURL().then((url)=>{
  									this.imageURL=url;
  									resolve(url);
  								}).catch((err)=>{
  									reject(err);
  								})
  							}).catch((err)=>{
  								reject(err);
  							})
    }, error => {
      this.error = JSON.stringify(error);
    });
  						}
  		);
  }
loading:any;
  

      	presentToast(text){
  		let toast = this.toastCtrl.create({
  			message: text,
  			duration: 3000,
  			position: 'top'
  		});
  		toast.present();
  	}
storeImage(){
  return new Promise((resolve, reject) =>{
  this.getLocalImg().then((url)=>{
        resolve(url);
      });
      })
}
 public getLocalImg(){
     return new Promise((resolve, reject) => {
    let actionSheet = this.actionSheet.create({
      title:"La source de l'image",
      buttons: [
        {
          text: "Choisir",
          handler: () => {
              this.storeImg(this.camera.PictureSourceType.PHOTOLIBRARY).then((url)=>{
              resolve(url);
            });
          }
        },
        {
          text: "Camera",
          handler: () => {
            this.storeImg(this.camera.PictureSourceType.CAMERA).then((url)=>{
                resolve(url);
              });
          }
        },
        {
          text: "Cancel",
          role: "cancel"
        }
      ]
    });
    actionSheet.present();
 });
  }
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
                  resolve(res.downloadURL)
                  //this.fireStore.ref('/msgpics').child(firebase.auth().currentUser.uid).getDownloadURL().then((url)=>{
                    //this.imageURL=url;
                    //resolve(url);
                 // }).catch((err)=>{
                   // reject(err);
                  //})
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
}
