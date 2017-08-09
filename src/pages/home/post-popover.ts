import { Component } from '@angular/core';
import { ViewController, ToastController, ModalController } from 'ionic-angular';
import { DocumentDetailPage } from '../modal/document-detail/document-detail';

@Component({
  template: `
    <ion-list>
      <button ion-item (click)="showDocumentDetail()">Details</button>
      <button ion-item (click)="close()">Partager URL</button>
    </ion-list>
  `
})
export class PostPopover {
  constructor(
         public modalCtrl: ModalController,public viewCtrl: ViewController, public toastCtrl: ToastController) {}

  close() {
    this.presentToast();
    this.viewCtrl.dismiss();
  }
  showDocumentDetail(){
	  	  	      // Open it as a modal page
	
    let modal = this.modalCtrl.create(DocumentDetailPage);

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