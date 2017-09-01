import { Component, ViewChild, Input, ChangeDetectorRef, NgZone,  } from '@angular/core';
import { NavController, Events, LoadingController, App, Content, PopoverController, AlertController, ModalController, Tabs } from 'ionic-angular';
import { DocumentViewer, DocumentViewerOptions } from '@ionic-native/document-viewer';
import { PostPopover } from './post-popover';
import { MessagePage } from  '../message/message';
// import { WelcomePage } from  '../welcome/welcome';
import { NewEventPage } from '../modal/new-event/new-event';
import { NewDocumentPage } from '../modal/new-document/new-document';
import { EventProvider } from '../../providers/eventProvider';

import { AuthService } from '../../providers/auth-service/auth-service';

import { File } from '@ionic-native/file';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { MediatorProvider } from '../../providers/mediatorProvider';
import { LogProvider } from '../../providers/logProvider';

import { GlobalStatictVar, User } from "../../shared/interfaces";
import { DocumentProvider } from '../../providers/document/document';


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
  userDetails : any={} ;
  responseData: any;
  dataSet : any;
  tabs:Tabs;
  userPostData = {"user_id":"","token":""};
  fileTransfer: FileTransferObject = this.transfer.create();

  constructor(public navCtrl: NavController,
  	public popoverCtrl: PopoverController,
  	private document: DocumentViewer,
  	private app: App,
    public zone:NgZone,
    public authService:AuthService,
    private file: File,
    public modalCtrl:ModalController,
	  private barcodeScanner:BarcodeScanner,
	  private loadingCtrl:LoadingController,
	  public alertCtrl: AlertController,
    private transfer: FileTransfer,
    public events: Events,
    public documentProvider:DocumentProvider,
    public logProvid: LogProvider, 
    public eventProvider:EventProvider,
    public changeDetectionRef: ChangeDetectorRef,
    public medProvid: MediatorProvider) 
  {
    // if (JSON.parse(localStorage.getItem('userData'))){
    // const data = JSON.parse(localStorage.getItem('userData'));
    // this.userDetails = data.userData;
    // this.userPostData.user_id = this.userDetails.id;
    // this.userPostData.token = this.userDetails.token;
    //        let user = {
    //         uid: '',
    //         password:'',
    //         email: '',
    //         photo:'',
    //         username:''
    //     };
    this.tabs = this.navCtrl.parent;
    let self =this;
        events.subscribe(GlobalStatictVar.NOTIFICATION_EVENT, (notify) => {
        this.logProvid.log('notify: ' + notify);
          self.zone.run(()=>{
        if (notify) {

          this.newMsgCount++;
        } else {
          this.newMsgCount--;
        }
          });
      this.changeDetectionRef.detectChanges();
    });
        this.authService.getUserDetails().then((user:any)=>{
          self.userDetails = user;
          self.userDetails.displayName=user.firstName+" "+user.lastName;
          self.authService.updateUserLocal(self.userDetails);
        }, (err)=>{
       self.userDetails= self.authService.getUserLocal();

        })
    this.getDocuments();
          //let userDet = this.userDetails;
                // user.uid = userDet.id;
                // user.email = userDet.email;
                // user.username = userDet.username;
                // user.photo = userDet.profile_image;
               // this.medProvid.saveLoggedinUser(user);
                
  // }
  // else{
  //   this.navCtrl.push(WelcomePage);
  // }
  }
  goToMyProfile(){
    this.tabs.select(3);
  }
  newEvent(){
    let modal = this.modalCtrl.create(NewEventPage, {selectedDay: new Date()});
    modal.present();
    modal.onDidDismiss(data =>{
      if (data) {
        let eventData = data;
        this.eventProvider.addEvent(eventData);  
      }
    });
  }
  newFile(){
    this.documentProvider.ask().then((res)=>{
      this.newDocument(res);
    });
  }
  newDocument(res=null){
    let modal;
    if(res===null){
      modal = this.modalCtrl.create(NewDocumentPage);   
    }
    else{
      modal = this.modalCtrl.create(NewDocumentPage, {'docData':res});   
    }
    modal.present();
  }
  getDocuments(){
	   // let loader = this.loadingCtrl.create({
    //   duration: 200
    // });
    // loader.present(); 
      // this.authService.postData(this.userPostData, 'documents')
      // .then((result) => {
      //   this.responseData = result;
      //   if (this.responseData.documentsData) {
      //     this.dataSet = this.responseData.documentsData;
      //   } else {}
      // }, (err) => {

      // });
      this.documentProvider.getDocuments().subscribe(data=>{
        let documents = [];
        let self =this;
        self.dataSet = []
         data.forEach((doc)=>{
           let document =doc;
          let userRef= this.documentProvider.getUser(doc.authorUid);
           userRef.once('value').then( (snapshot) => {
           //let user = result['userData'];
          // user.uid = user.id;
           //user.photo= user.profile_image;
           // let user = snapshot.val();
           // user.displayName = user.firstName+" "+user.lastName;
           document.user = snapshot.val();
           console.log(document);
           documents.push(document);
           // self.dataSet.push(documents);

           self.zone.run(()=>{
            self.dataSet.push(document);
           })
         });
      })
     })
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
  console.log(/*this.file.dataDirectory+'file.pdf'*/pathto);
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
  presentPostPopover(key) {
    let popover = this.popoverCtrl.create(PostPopover, {'key':key});

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
