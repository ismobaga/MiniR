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
import { EditNamePage } from '../modal/edit-name/edit-name';
import { EditAnneePage } from '../modal/edit-annee/edit-annee';
import { DocumentDetailPage } from '../modal/document-detail/document-detail';

import { WelcomePage } from  '../welcome/welcome';


import { File } from '@ionic-native/file';
import { Transfer, TransferObject, FileUploadOptions } from '@ionic-native/transfer';
import { FilePath } from '@ionic-native/file-path';
import { Camera } from '@ionic-native/camera';

import { AuthService } from '../../providers/auth-service/auth-service';

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
         private app:App,
		 public alertCtrl:AlertController,
         public modalCtrl: ModalController,
         public authService:AuthService
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
        this.storageDirectory = cordova.file.documentsDirectory;
      } else if(this.platform.is('android')) {
        this.storageDirectory = cordova.file.dataDirectory;
      } 

	  console.log("platform", this.platform);
  }

  getMyDocuments(){
      this.authService.postData(this.userPostData, 'documents/'+this.userPostData.user_id)
      .then((result) => {
        this.responseData = result;
        if (this.responseData.documentsData) {
          this.documents = this.responseData.documentsData;
		  console.log(this.documents);
        } else {}
      }, (err) => {

      });
  }

  logout(){
     localStorage.clear();
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
  	//console.log(refresher);
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
	public takePicture2(){
		let options = {
			quality:100,
		};
		this.camera.getPicture(options).then((imageData)=> {
			
			const fileTranfer: TransferObject = this.transfer.create();
			let options1: FileUploadOptions = {
				fileKey: 'file',
				fileName: 'name.jpg',
				headers:{}
			};
			fileTranfer.upload(imageData, 'http://cdi.x10.mx/upload.php', options1)
			.then((data) =>{
				alert("success");
			},(err)=>{
				alert("error "+JSON.stringify(err));
			});
		});
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
				this.log = filePath;
  				let corretPath = filePath.substr(0, filePath.lastIndexOf('/')+1);
  				let currentName = imagePath.substring(imagePath.lastIndexOf('/')+1,  imagePath.lastIndexOf('?'));
  				this.copyFileToLocalDir(corretPath, currentName, this.createFileName());
  			});
  		}
  		else{
  			var currentName = imagePath.substr(imagePath.lastIndexOf('/')+1);
			var corretPath = imagePath.substr(0, imagePath.lastIndexOf('/')+1);
			this.log = corretPath;
			this.copyFileToLocalDir(corretPath, currentName, this.createFileName());
  		}
  	}, (err) => {
  		this.presentToast("Erreur lors de la selection d'image");
  	});

  }
  	copyFileToLocalDir(namePath, currentPath, newFileName){
  		this.file.copyFile(namePath, currentPath, this.storageDirectory, newFileName).then((success) => {
  			this.lastImage = newFileName;
  			this.bgImage = this.pathForImage(newFileName);
			this.presentToast("Sauvegarde reusit");
		         const alertFailure = this.alertCtrl.create({
            title: 'Download Success!',
            subTitle: this.bgImage,
            buttons: ['Ok']
          });
          alertFailure.present();
  		}, (error) => {
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
  			return this.storageDirectory + img;
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
        console.log(data);
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
