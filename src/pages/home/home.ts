import { Component, ViewChild } from '@angular/core';
import { NavController, App, Content, PopoverController } from 'ionic-angular';
import { DocumentViewer, DocumentViewerOptions } from '@ionic-native/document-viewer';
import { PostPopover } from './post-popover';
import { MessagePage } from  '../message/message';

import { AuthService } from '../../providers/auth-service/auth-service';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
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

  constructor(public navCtrl: NavController,
  	public popoverCtrl: PopoverController,
  	private document: DocumentViewer,
  	private app: App,
    public authService:AuthService) 
  {
    const data = JSON.parse(localStorage.getItem('userData'));
    this.userDetails = data.userData;
    this.userPostData.user_id = this.userDetails.id;
    this.userPostData.token = this.userDetails.token;
    this.getDocuments();

  }

  getDocuments(){
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
    swipePage(event) {
    if(event.direction === 1) { // Swipe Left
      console.log("Swap Camera");
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
}
if (type==='image') {
	
	this.document.viewDocument(url, 'image/jpeg', options)
}
else{
	this.document.viewDocument(url, 'application/'+type, options)
}

	
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
