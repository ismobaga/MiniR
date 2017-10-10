import { Component, ViewChild, Input, ChangeDetectorRef, NgZone, ElementRef  } from '@angular/core';
import { NavController, Events, LoadingController, App, Content, PopoverController, AlertController, ModalController, Tabs } from 'ionic-angular';
import { DocumentViewer, DocumentViewerOptions } from '@ionic-native/document-viewer';
import { PostPopover } from './post-popover';
import { MessagePage } from  '../message/message';
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
import { QRResult } from '../popover/qr-result/qr-result';
import { ImageViewer } from '../modal/image-viewer/image-viewer';
import { ImageViewerController } from 'ionic-img-viewer';
import { ImageLoaderConfig } from 'ionic-image-loader';
import { ImageLoader } from 'ionic-image-loader';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
    @Input()
  newMsgCount: number = 0;
    @ViewChild(Content) content: Content;
    @ViewChild('myImage') myImage: ElementRef;

  public like_btn = {
    color: 'black',
    icon_name: 'ios-thumbs-up-outline',
    icon_name_liked : 'thumbs-up',
     color_liked : 'danger'
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
    private imageLoader: ImageLoader,
    private imageLoaderConfig: ImageLoaderConfig,
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
    public imageViewerCtrl: ImageViewerController,
    public medProvid: MediatorProvider) 
  {
this.imageLoaderConfig.enableDebugMode();
this.imageLoaderConfig.useImageTag(true);
this.imageLoaderConfig.setCacheDirectoryName('im-net');
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
  likeDocument(key, number){

  }
  myImageSrc;
  opendDocument(document:any){
    let img = this.myImage.nativeElement.querySelector('img','.thumb-img')
    let modal;

    this.myImageSrc = document.downloadURL;
    if(document.hasFile)
    {
      this.imageLoader.preload(this.myImageSrc);
      // modal = this.modalCtrl.create(ImageViewer, {'images': img}); 
      modal = this.imageViewerCtrl.create(img)  
    modal.present();
     modal.onDidDismiss(() => this.myImageSrc = "");
    }
  }
        documents = [];
  getDocuments(){

      this.documentProvider.getDocuments().subscribe(data=>{
        let self =this;
        self.documents = [];
        self.dataSet = []
         data.forEach((doc)=>{
           let document =doc;
          let userRef= this.documentProvider.getUser(doc.authorUid);
           userRef.once('value').then( (snapshot) => {

           document.liked = false
           let merciTab : Array<string> = <Array<string>> doc.merciArray;
           if (merciTab) {
             document.liked =  merciTab[doc.authorUid]==doc.authorUid;
    

           }
           document.user = snapshot.val();
           //console.log(document);
           // self.dataSet.push(documents);
     

           self.zone.run(()=>{
            self.documents.push(document);
          // self.documents[document.$key] = document;
            //self.dataSet[document.$key] =document;
           })
         });
      })
     })
  }
  //75;1065    
  convertTime(created) {
    let date = new Date(created);
    return date;
  }
  toUpper(str:string){
    return str.toUpperCase();
  }
  goMessages(){
  	///this.app.getRootNav().push(MessagePage);
    this.navCtrl.push(MessagePage);
  }
  goCodeScanner(){
	      console.log("Scanner Camera");
			let loader = this.loadingCtrl.create({
      duration: 200
    });
	let result;
    loader.present()
	  this.barcodeScanner.scan().then((barcodeData) => {
		  // console.log(barcodeData.text);
      let qrResult:any = barcodeData.text;
      qrResult.uid =this.userDetails.uid
		  // let qrResult = JSON.stringify(barcodeData.text);
      let popover = this.popoverCtrl.create(QRResult, {qrResult});
      popover.present();

	  }, (err)=>{
		  console.log("Error:", err);
		   result = JSON.stringify(err);
      let popover = this.popoverCtrl.create(QRResult, {'err':err});
      popover.present();
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
      //this.likeButton();
    }
  }

  viewFile(url, type){
  	const options: DocumentViewerOptions = {
  	title: 'My Viewer'
};

  let pathto = this.downloadFile(url);
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
    let popover = this.popoverCtrl.create(PostPopover, {'key':key, 'uid': this.userDetails.uid});

    popover.present();
  }

    likeButton(key) {
 

    this.documentProvider.like(key, this.userDetails.uid);
  }

}
