import { Component } from '@angular/core';
import {
         NavController, 
         NavParams, 
         ActionSheetController, 
         ToastController, 
         Platform, 
         Loading, 
         LoadingController,
         ModalController
         } from 'ionic-angular';
import { EditNamePage } from '../modal/edit-name/edit-name';
import { EditAnneePage } from '../modal/edit-annee/edit-annee';

import { File } from '@ionic-native/file';
import { Transfer, TransferObject } from '@ionic-native/transfer';
import { FilePath } from '@ionic-native/file-path';
import { Camera } from '@ionic-native/camera';
/**
 * Generated class for the ProfilePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
 declare var cordova: any;
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
	lastImage:string = null;
	loading: Loading;
  profile_segment: string;
	bgImage:string = "http://miaafho.ml/img/profile.jpg";
  constructor(public navCtrl: NavController,
  			 public navParams: NavParams, 
  			 private camera: Camera, 
  			 private transfer: Transfer,
  			 private file: File,
  			 private filePath: FilePath,
  			 public actionSheet: ActionSheetController,
  			 public toastCtrl: ToastController,
  			 public platform: Platform,
  			 public loadingCtrl: LoadingController,
         public modalCtrl: ModalController
  			 ) 
  {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
    this.profile_segment = 'timeline';
  }
  public doRefresh(refresher){
  	//console.log(refresher);
  	setTimeout(()=> {
  		refresher.complete();
  	}, 1000);
  }
    goEditProfileName() {
    // Open it as a modal page
    let modal = this.modalCtrl.create(EditNamePage);
    modal.present();
  }
  goEditProfileAnnee() {
    // Open it as a modal page
    let modal = this.modalCtrl.create(EditAnneePage);
    modal.present();
  }

  public presentActionSheet(){
  	let actionSheet = this.actionSheet.create({
  		title:"La source de l'image",
  		buttons: [
	  		{
	  			text: "Choisir",
	  			handler: () => {
	  				this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
	  			}
	  		},
	  		{
	  			text: "Camera",
	  			handler: () => {
	  				this.takePicture(this.camera.PictureSourceType.CAMERA);
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

  public takePicture(sourceType){
  	//les options for camera
  	var options = {
  		quality: 100,
  		sourceType: sourceType,
  		saveToPhotoAlbum: false,
  		correctOrientation:true
  	};

  	this.camera.getPicture(options).then((imagePath) => {
  		//gestion pour android
  		if (this.platform.is('android') && sourceType === this.camera.PictureSourceType.PHOTOLIBRARY) {
  			this.filePath.resolveNativePath(imagePath)
  			.then(filePath =>{
  				let corretPath = filePath.substr(0, filePath.lastIndexOf('/')+1);
  				let currentName = imagePath.substring(imagePath.lastIndexOf('/')+1,  imagePath.lastIndexOf('?'));
  				this.copyFileToLocalDir(corretPath, currentName, this.createFileName());
  			});
  		}
  		else{
  			var currentName = imagePath.substr(imagePath.lastIndexOf('/')+1);
			var corretPath = imagePath.substr(0, imagePath.lastIndexOf('/')+1);
			this.copyFileToLocalDir(corretPath, currentName, this.createFileName());
  		}
  	}, (err) => {
  		this.presentToast("Erreur lors de la selection d'image");
  	});

  }
  	copyFileToLocalDir(namePath, currentPath, newFileName){
  		this.file.copyFile(namePath, currentPath, cordova.file.dataDirectory, newFileName).then(success => {
  			this.lastImage = newFileName;
  			this.bgImage = this.pathForImage(newFileName);

  		}, error => {
  			this.presentToast("Erreur lors de la sauvegarde");
  		});
  	}

  	presentToast(text){
  		let toast = this.toastCtrl.create({
  			message: text,
  			duration: 3000,
  			position: 'top'
  		});
  		toast.present();
  	}
  	public pathForImage(img){
  		if (img === null) {
  			return '';
  		}
  		else{
  			return cordova.file.dataDirectory + img;
  		}
  	}

  	public uploadImage(){
  		var url = "http://urlto./upload.php";

  		var targetPath = this.pathForImage(this.lastImage);
  		//file name
  		var filename = this.lastImage;

  		var options = {
  			fileKey: "file",
  			fileName: filename,
  			chunkedMode: false,
  			mimeType: "multipart/form-data",
  			params: { 'filename': filename}
  		};
  		const fileTransfer: TransferObject = this.transfer.create();
  		this.loading = this.loadingCtrl.create({
  			content:'Cargement...',
  		});
  		this.loading.present();

  		fileTransfer.upload(targetPath, url, options).then(data =>{
  			this.loading.dismissAll();
  			this.presentToast('Image charger avec successs');
  		}, err => {
  			this.loading.dismissAll();
  			this.presentToast('Erreur lors du chargement');

  		});
  	}

  	createFileName(){
  		var d = new Date();
  		var n = d.getTime();
  		return n + '.jpg';
  	}


}
