import { Component } from '@angular/core';
import { ViewController, ToastController, ModalController, NavParams } from 'ionic-angular';
import { DocumentDetailPage } from '../../modal/document-detail/document-detail';
import { EventDetailPage } from '../../modal/event-detail/event-detail';
import { GlobalStatictVar } from "../../../shared/interfaces";
import { EventProvider } from '../../../providers/eventProvider';

import { DocumentProvider } from '../../../providers/document/document';

@Component({
  template: `

    <ion-list class="dcard">
        <ion-item id="fileDiv" no-lines>
          <div id="name">
            <h3>Document</h3>
          </div>
        </ion-item>
    <p class="tagText">
      {{display}}
    </p>
  
   
   <ion-row no-padding no-margin>
    <ion-col no-padding no-margin col-2></ion-col>
      <ion-col no-padding no-margin text-center col-8>
        <button ion-button id="viewBtn"  clear  (click)="viewDocument()">Ouvrir</button>
    </ion-col>
    <ion-col col-1></ion-col>
  </ion-row>
</ion-list>

  `
})
export class QRResult {
  data:any;
  event:any;
  document:any;
  text:any;
  display:string
  
  constructor(public eventProvider: EventProvider,
              public documentProvider: DocumentProvider,
              public modalCtrl: ModalController,
              public viewCtrl: ViewController, 
              public toastCtrl: ToastController, 
              public navParms: NavParams) {
    this.data = this.navParms.data;
    this.display = this.data.qrResult;
    this.getData();

  }
  getData(){
    if (this.data.type==GlobalStatictVar.DATA_TYPE_EVENT) {
      this.text = "Evenement"
      this.eventProvider.getEvent(this.data.key).once('value').then((data) => {
      this.event = data.val();
      this.eventProvider.getUser(this.event.uid).once('value').then(user => {
        this.event.user = user.val();
        });
      });
    }
    else if (this.data.type == GlobalStatictVar.DATA_TYPE_POST) {
      this.documentProvider.getDocument(this.data.key).once('value').then((data)=>{
        this.text = "Post"
        this.document = data.val();
        this.documentProvider.getUser(this.document.uid).once('value').then((author)=>{
          this.document.author = author.val();
        })
      })
    }

  }
  close() {
    this.presentToast();
    this.viewCtrl.dismiss();
  }
  showDocumentDetail(){
	  	  	      // Open it as a modal page
	
    let modal = this.modalCtrl.create(DocumentDetailPage, this.navParms.data);

	modal.present();
	this.viewCtrl.dismiss()
  }

  presentToast() {
    let toast = this.toastCtrl.create({
      message: 'Notification',
      duration: 2000
    });
    toast.present();
  }

  viewDocument(){

  }
}