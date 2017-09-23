import { Component } from '@angular/core';
import { ViewController, ToastController, ModalController, NavParams } from 'ionic-angular';
import { DocumentDetailPage } from '../../modal/document-detail/document-detail';
import { EventDetailPage } from '../../modal/event-detail/event-detail';
import { GlobalStatictVar } from "../../../shared/interfaces";
import { EventProvider } from '../../../providers/eventProvider';

import { DocumentProvider } from '../../../providers/document/document';

@Component({
  template: `
    <ion-card>
      <button ion-item (click)="showDocumentDetail()">Details</button>
      <button ion-item (click)="close()">Partager URL</button>
    </ion-card>
  `
})
export class QRResult {
  data:any;
  event:any;
  document:any;
  constructor(public eventProvider:EventProvider,
              public documentProvider: DocumentProvider,
         public modalCtrl: ModalController,public viewCtrl: ViewController, public toastCtrl: ToastController, public navParms: NavParams) {
    this.data = this.navParms.data;

  }
  getData(){
    if (this.data.type==GlobalStatictVar.DATA_TYPE_EVENT) {
      this.eventProvider.getEvent(this.data.key).once('value').then((data) => {
      this.event = data.val();
      this.eventProvider.getUser(this.event.uid).once('value').then(user => {
        this.event.user = user.val();
        });
      });
    }
    else if (this.data.type == GlobalStatictVar.DATA_TYPE_POST) {
      this.documentProvider.getDocument(this.data.key).once('value').then((data)=>{
        this.document = data.val();
        this.documentProvider.getUser(this.document.uid).once('value').then((author)=>{
          this.document.author = author.val();
        })
      })
    }{

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
}