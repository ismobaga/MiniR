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
            <h3>{{title}}</h3>
          </div>
        </ion-item>
    <p class="tagText">
      {{text}}
    </p>
  
   
   <ion-row no-padding no-margin>
    <ion-col no-padding no-margin col-2></ion-col>
      <ion-col no-padding no-margin text-center col-8>
        <button ion-button id="viewBtn"  clear  (click)="openIt()">Ouvrir</button>
    </ion-col>
    <ion-col col-1></ion-col>
  </ion-row>
</ion-list>
  `,
  selector: 'page-qr-result',
})
export class QRResult {
  data:any;
  event:any;
  document:any;
  title:any;
  text:string;
  docOrEv:boolean;
  
  constructor(public eventProvider: EventProvider,
              public documentProvider: DocumentProvider,
              public modalCtrl: ModalController,
              public viewCtrl: ViewController, 
              public toastCtrl: ToastController, 
              public navParms: NavParams) {
    this.data = this.navParms.data;
    this.data = JSON.parse(this.data.qrResult|| JSON.stringify(null));
    this.getData();

  }
  getData(){
    if(this.data){
    if (this.data.type==GlobalStatictVar.DATA_TYPE_EVENT) {
      this.title = "Evenement"
      this.eventProvider.getEvent(this.data.key).once('value').then((data) => {
      this.event = data.val();
      this.document = false;
      this.docOrEv = true;

      if(this.event.title){
        this.text = this.event.title;
      }
      this.eventProvider.getUser(this.event.uid).once('value').then(user => {
        this.event.user = user.val();
        });
      });
    }
    else if (this.data.type == GlobalStatictVar.DATA_TYPE_POST) {

      this.documentProvider.getDocument(this.data.key).once('value').then((data)=>{
        this.title = "Post";
        this.docOrEv = true;
        this.document = data.val();
        this.text = this.document.text;
        this.documentProvider.getUser(this.document.uid).once('value').then((author)=>{
          this.document.author = author.val();
        })
      })
    }
    else{
      this.title = "Not found";
      this.text = "Code Non Valide";
    }

  }

  }
  openIt(){
    if (this.data.type==GlobalStatictVar.DATA_TYPE_POST) {
      this.viewDocument();
    }
    else if(this.data.type==GlobalStatictVar.DATA_TYPE_EVENT){
      this.viewEvent();
    }
    else{
      this.close();
    }
  }
  viewEvent(){

    this.event.startTime = new Date(this.event.startTime);
     this.event.endTime = new Date(this.event.endTime);
    console.log("Dans eve", event);
    
     let modal = this.modalCtrl.create(EventDetailPage, this.event);
    modal.present();
    modal.onDidDismiss(data =>{
      
    });

  }
  close() {
    this.presentToast();
    this.viewCtrl.dismiss();
  }


  presentToast() {
    let toast = this.toastCtrl.create({
      message: 'Notification',
      duration: 2000
    });
    toast.present();
  }

  viewDocument(){
      let modal = this.modalCtrl.create(DocumentDetailPage, {'key':this.data.key, 'uid': this.data.uid});
      modal.present();
   this.viewCtrl.dismiss()
  }
}