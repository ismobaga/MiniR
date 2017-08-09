import { Component } from '@angular/core';
import {
         NavController, 
         NavParams, 
         ActionSheetController, 
         ToastController, 
         Platform, 
         Loading, 
         App,
		 AlertController,
         LoadingController,
         ModalController
         } from 'ionic-angular';
import {Http, Response} from "@angular/http";
import "rxjs/add/operator/map";
import "rxjs/add/operator/catch";
import 'rxjs/add/observable/throw';
import {Observable} from "rxjs";
import { EditNamePage } from '../modal/edit-name/edit-name';
import { EditAnneePage } from '../modal/edit-annee/edit-annee';
import { DocumentDetailPage } from '../modal/document-detail/document-detail';

import { WelcomePage } from  '../welcome/welcome';


import { File, FileEntry } from '@ionic-native/file';
import { Transfer, TransferObject, FileUploadOptions } from '@ionic-native/transfer';
import { FilePath } from '@ionic-native/file-path';
import { Camera } from '@ionic-native/camera';

import { AuthService } from '../../providers/auth-service/auth-service';
import { MediatorProvider } from '../../providers/mediatorProvider';

 declare var cordova: any;
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
	lastImage:string = null;
	loading: Loading;
  profile_segment: string;
  userDetails : any;
  responseData: any;
  dataSet : any;
  documents:any;
  bgImage:any ="http://cdi.x10.mx/files/images/logo.png";
  userPostData = {"user_id":"","token":""};
  storageDirectory: string = '';
  log:any;
  timeStamp:any = Date.now()*1000;
  error:any;


  constructor(public navCtrl: NavController,
  			 public navParams: NavParams, 
         private readonly http: Http,
  			 private camera: Camera, 
  			 private transfer: Transfer,
  			 private file: File,
  			 private filePath: FilePath,
  			 public actionSheet: ActionSheetController,
  			 public toastCtrl: ToastController,
  			 public platform: Platform,
  			 public loadingCtrl: LoadingController,
         private app:App,
		     public alertCtrl:AlertController,
         public modalCtrl: ModalController,
         public authService:AuthService,
         public medProvid:MediatorProvider
  			 ) 
  {
    if (JSON.parse(localStorage.getItem('userData'))){
      const data = JSON.parse(localStorage.getItem('userData'));
      this.userDetails = data.userData;
      this.userPostData.user_id = this.userDetails.id;
      this.userPostData.token = this.userDetails.token;
      this.getMyDocuments();
     }
  else{
    this.navCtrl.push(WelcomePage);
  }
        //Platform check to determine storage directory prefix
      if (this.platform.is('ios')) {
       // this.storageDirectory = cordova.file.documentsDirectory;
      } else if(this.platform.is('android')) {
       // this.storageDirectory = cordova.file.dataDirectory;
      } 

  }
getTimeStamp(){
  return "?"+this.timeStamp;
}
  getMyDocuments(){
      this.authService.postData(this.userPostData, 'documents/'+this.userPostData.user_id)
      .then((result) => {
        this.responseData = result;
        if (this.responseData.documentsData) {
          this.documents = this.responseData.documentsData;
        } else {}
      }, (err) => {

      });
  }

  logout(){
     localStorage.clear();
     this.medProvid.logout();
     setTimeout(() => this.backToWelcome(), 1000);
}
backToWelcome(){
     const root = this.app.getRootNav();
     root.popToRoot();
}
  ionViewDidLoad() {
    this.profile_segment = 'timeline';
  }
  public doRefresh(refresher){
    this.authService.postData(this.userPostData, 'user/'+this.userPostData.user_id)
        .then((result) => {
        // localStorage.removeItem('userData');
        let data = result;
        data['userData']['token']= this.userPostData.token;
        localStorage.setItem('userData', JSON.stringify(data));
        this.loadFromLocal();
		this.getMyDocuments();
      }, (err) => {
     });
    setTimeout(()=> {
      refresher.complete();
    }, 1000);
  }
  loadFromLocal(){
     const data = JSON.parse(localStorage.getItem('userData'));
      this.userDetails = data.userData;


  }
  goSettingsPage(){
	      // Open it as a modal page
	let params = this.userPostData;
	params['first_name']= this.userDetails.first_name
	params['last_name']= this.userDetails.last_name;
    let modal = this.modalCtrl.create(EditNamePage, params);
	modal.onDidDismiss(() => {
     
	   const data = JSON.parse(localStorage.getItem('userData'));
    this.userDetails = data.userData;
	console.log(data);

   });
	modal.present();
  }
  goShowDocumentDetails(id){
	  	      // Open it as a modal page
	let params = this.userPostData;
	params['first_name']= this.userDetails.first_name
	params['last_name']= this.userDetails.last_name;
    let modal = this.modalCtrl.create(DocumentDetailPage, params);

	modal.present();
  }
    goEditProfileName() {
    // Open it as a modal page
	let params = this.userPostData;
	params['first_name']= this.userDetails.first_name
	params['last_name']= this.userDetails.last_name;
    let modal = this.modalCtrl.create(EditNamePage, params);
	modal.onDidDismiss(() => {
     
	   const data = JSON.parse(localStorage.getItem('userData'));
    this.userDetails = data.userData;
	console.log(data);

   });
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
	  				this.selectPhoto();
	  			}
	  		},
	  		{
	  			text: "Camera",
	  			handler: () => {
	  			    this.takePhoto();
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

 takePhoto() {
    this.camera.getPicture({
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
      sourceType: this.camera.PictureSourceType.CAMERA,
      encodingType: this.camera.EncodingType.PNG,
      saveToPhotoAlbum: true
    }).then(imageData => {
     // this.myPhoto = 'data:image/jpeg;base64,' + imageData;
      this.uploadImage2(imageData);
    }, error => {
      this.error = JSON.stringify(error);
    });
  }

  selectPhoto(): void {
    this.camera.getPicture({
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      destinationType: this.camera.DestinationType.FILE_URI,
      quality: 100,
      encodingType: this.camera.EncodingType.PNG,
    }).then(imageData => {
     // this.myPhoto = 'data:image/png;base64,' + imageData;
      this.uploadImage2(imageData);
    }, error => {
      this.error = JSON.stringify(error);
    });
  }

   public uploadImage2(targetPath: any){
      var url = "http://cdi.x10.mx/api/user/update/image";

      //var targetPath = this.pathForImage(this.lastImage);
      //file name
     //var filename = this.lastImage;

      var options = {
        fileKey: "profile",
        fileName: "image.png",
        chunkedMode: false,
        mimeType: "multipart/form-data",
        params: { 'token':this.userPostData.token,
                  'user_id': this.userPostData.user_id}
      };
      const fileTransfer: TransferObject = this.transfer.create();
      this.loading = this.loadingCtrl.create({
        content:'Cargement...',
      });
      this.loading.present();

      fileTransfer.upload(targetPath, url, options).then(data =>{
        this.loading.dismissAll();
        this.presentToast('Image charger avec successs');
        let res:any = {image_url:""};

        res = data.response;
          this.userDetails.profile_image = res.image_url;
        this.timeStamp = Date.now()*1000;
      }, err => {
        this.loading.dismissAll();
        this.presentToast('Erreur lors du chargement');

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
  			return this.storageDirectory + img;
  		}
  	}

  	createFileName(){
  		var d = new Date();
  		var n = d.getTime();
  		return n + '.jpg';
  	}


}
