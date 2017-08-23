import { Component, NgZone } from '@angular/core';
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
  			 public actionSheet: ActionSheetController,
  			 public toastCtrl: ToastController,
  			 public loadingCtrl: LoadingController,
         private app:App,
         public zone:NgZone,
		     public alertCtrl:AlertController,
         public modalCtrl: ModalController,
         public authService:AuthService,
         public medProvid:MediatorProvider
  			 ) 
  {
    if (JSON.parse(localStorage.getItem('userData'))){
      const data = JSON.parse(localStorage.getItem('userData'));
      this.userDetails = data;
      this.userPostData.user_id = "1";
      this.userPostData.token = "this.userDetails.token";
      this.getMyDocuments();
     }
  else{
    this.navCtrl.push(WelcomePage);
  }
       
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
    this.loadUserdetails();
  }
  loadUserdetails(){
    this.authService.getUserDetails().then((res:any)=> {
      this.userDetails = res;
      this.zone.run(()=>{
        this.userDetails.photoURL= res.photoURL;
      })
    })
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
	let params = [];
	params['firstName']= this.userDetails.firstName
	params['lastName']= this.userDetails.lastName;
    let modal = this.modalCtrl.create(EditNamePage, params);
	modal.onDidDismiss(() => {
     
	   let name = JSON.parse(localStorage.getItem('name'));
    this.zone.run(()=>{
      this.userDetails.firstName= name.firstName;
      this.userDetails.lastName = name.lastName;
    })
	    

   });
	modal.present();
  }
  goEditProfileAnnee() {
    // Open it as a modal page
    let modal = this.modalCtrl.create(EditAnneePage);
   // modal.present();
  }
  editProfilePicture(){
    this.authService.updateUserProfilePicture().then((url)=>{
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



}
