import { Component, ViewChild, Input, ChangeDetectorRef } from '@angular/core';
import { NavController, Events, LoadingController, App, Content, PopoverController, AlertController } from 'ionic-angular';
import { DocumentViewer, DocumentViewerOptions } from '@ionic-native/document-viewer';
import { PostPopover } from './post-popover';
import { MessagePage } from  '../message/message';
import { WelcomePage } from  '../welcome/welcome';

import { AuthService } from '../../providers/auth-service/auth-service';

import { File } from '@ionic-native/file';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { MediatorProvider } from '../../providers/mediatorProvider';
import { LogProvider } from '../../providers/logProvider';

import { GlobalStatictVar } from "../../shared/interfaces";


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
    @Input()
  newMsgCount: number = 0;
    @ViewChild(Content) content: Content;

  public like_btn = {
    color: 'black',
    icon_name: 'heart-outline'
  };

  public tap: number = 0;
  userDetails : any;
  responseData: any;
  dataSet : any;
  userPostData = {"user_id":"","token":""};
  fileTransfer: FileTransferObject = this.transfer.create();

  constructor(public navCtrl: NavController,
  	public popoverCtrl: PopoverController,
  	private document: DocumentViewer,
  	private app: App,
    public authService:AuthService,
    private file: File,
	private barcodeScanner:BarcodeScanner,
	private loadingCtrl:LoadingController,
	public alertCtrl: AlertController,
    private transfer: FileTransfer,
    public events: Events,
    public logProvid: LogProvider, 
    public changeDetectionRef: ChangeDetectorRef,
    public medProvid: MediatorProvider) 
  {
    if (JSON.parse(localStorage.getItem('userData'))){
    const data = JSON.parse(localStorage.getItem('userData'));
    this.userDetails = data.userData;
    this.userPostData.user_id = this.userDetails.id;
    this.userPostData.token = this.userDetails.token;
           let user = {
            uid: '',
            password:'',
            email: '',
            photo:'',
            username:''
        };
        events.subscribe(GlobalStatictVar.NOTIFICATION_EVENT, (notify) => {
      this.logProvid.log('notify: ' + notify);
      if (notify) {
        this.newMsgCount++;
      } else {
        this.newMsgCount--;
      }
      this.changeDetectionRef.detectChanges();
    });
    this.getDocuments();
          let userDet = this.userDetails;
                user.uid = userDet.id;
                user.email = userDet.email;
                user.username = userDet.username;
                user.photo = userDet.profile_image;
                this.medProvid.saveLoggedinUser(user);
                
  }
  else{
    this.navCtrl.push(WelcomePage);
  }
  }

  getDocuments(){
	   let loader = this.loadingCtrl.create({
      duration: 200
    });
    loader.present(); 
      this.authService.postData(this.userPostData, 'documents')
      .then((result) => {
        this.responseData = result;
        if (this.responseData.documentsData) {
          this.dataSet = this.responseData.documentsData;
        } else {}
      }, (err) => {

      });
  }
  convertTime(created) {
    let date = new Date(created);
    return date;
  }
  toUpper(str:string){
    return str.toUpperCase();
  }
  goMessages(){
  	this.app.getRootNav().push(MessagePage);
  }
  goCodeScanner(){
	        console.log("Scanner Camera");
			let loader = this.loadingCtrl.create({
      duration: 200
    });
	let result;
    loader.present(); 
	  this.barcodeScanner.scan().then((barcodeData) => {
		  console.log(barcodeData);
		  result = JSON.stringify(barcodeData);
		  	  const alertFailure = this.alertCtrl.create({
        title: 'Resultat!',
        subTitle: result ,buttons: ['Ok']
      });
	  alertFailure.present();
	  }, (err)=>{
		  console.log("Error:", err);
		  	  const alertFailure = this.alertCtrl.create({
        title: 'Resultat!',
        subTitle: result ,buttons: ['Ok']
      });
	  alertFailure.present();
	  });

  }
    swipePage(event) {
		console.log(event.direction);
    if(event.direction === 4) { // Swipe Left
      console.log("Swap Camera");
		this.goCodeScanner();
    } 

    if(event.direction === 2) { // Swipe Right
      this.goMessages();
    }
    
  }

    tapPhotoLike(times) { // If we click double times, it will trigger like the post
    this.tap++;
    if(this.tap % 2 === 0) {
      this.likeButton();
    }
  }

  viewFile(url, type){
  	const options: DocumentViewerOptions = {
  	title: 'My Viewer'
};

  let pathto = this.downloadFile(url);
  console.log(this.file.dataDirectory+'file.pdf');
  console.log('Viewer');
	this.document.viewDocument(this.file.dataDirectory+'file.pdf', 'application/pdf', options)
}

	
  

  downloadFile(url): any{
    this.fileTransfer.download(url, "file:///persistent/file.pdf", true).then((entry) => {
    console.log('download complete: ' + entry.toURL());
    console.log("entry", entry);
    return entry;
  }, (error) => {
    // handle error
  });
  }
  presentPostPopover() {
    let popover = this.popoverCtrl.create(PostPopover);

    popover.present();
  }
    likeButton() {
    if(this.like_btn.icon_name === 'heart-outline') {
      this.like_btn.icon_name = 'heart';
      this.like_btn.color = 'danger';
      // Do some API job in here for real!
    }
    else {
      this.like_btn.icon_name = 'heart-outline';
      this.like_btn.color = 'black';
    }
  }

}
