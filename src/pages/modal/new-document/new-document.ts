import { Component } from '@angular/core';
import { Platform, ViewController, LoadingController, NavController, NavParams, ModalController, AlertController } from 'ionic-angular';
import * as moment from 'moment';
import { DocumentProvider } from '../../../providers/document/document';
import { Keyboard } from '@ionic-native/keyboard';
import { IDocument } from '../../../shared/interfaces';
import { EditDocumentNamePage } from '../edit-document-name/edit-document-name'
import { EditTagsPage } from '../edit-tags/edit-tags'
/**
 * Generated class for the EditNamePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-new-document',
  templateUrl: 'new-document.html',
})
export class NewDocumentPage {
  document:IDocument  
  minDate= new Date().toISOString();
  title: string= null;
  documentLoaded: boolean = false;
  docData:any;
  constructor(
    public modalCtrl:ModalController,
    public platform:Platform,
    public keyboard:Keyboard,
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public loadingCtrl: LoadingController,
    public documentProvider:DocumentProvider
    ) {
    this.document = {text:"",name:"no name", views:0, merci:0, authorUid:"", date:"" , hasFile:false, downloadURL:"", tags:[], color:'red'};

        if (this.navParams.get('doc')) {
          setTimeout(()=>{

               this.documentLoaded = true;
               this.docData = this.navParams.get('docData');
               // this.document.extension = this.docData;
               this.document.hasFile = true;
               this.document.size = ''+((this.docData.metadata.size/1024)/1024 )+'Mo';
               this.document.extension = this.documentProvider.getExtFromMIME(this.docData.metadata.contentType);
               this.document.downloadURL = this.docData.downloadURL;
               this.document.fullPath = this.docData.ref.fullPath;
             }, 500);

    }
    else{
      this.document.hasFile = false;
  }

  if (this.platform.is('ios')) {
      let  appEl = <HTMLElement>(document.getElementsByTagName('ION-APP')[0]),
      appElHeight = appEl.clientHeight;
      this.keyboard.disableScroll(true);
      this.keyboard.onKeyboardShow().subscribe((e)=>{
        appEl.style.height = (appElHeight - (<any>e).keyboardHeight) + 'px';
      })
      window.addEventListener('native.keyboardhide', () => {
        appEl.style.height = '100%';
      });
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EditNamePage');
  }
  change() {
    // get elements
    var element   = document.getElementById('documentTextInput');
    var textarea  = element.getElementsByTagName('textarea')[0];

    // set default style for textarea
    textarea.style.minHeight  = '0';
    textarea.style.height     = '0';

    // limit size to 96 pixels (6 lines of text)
    var scroll_height = textarea.scrollHeight;
    if(scroll_height > 96)
      scroll_height = 96;

    // apply new style
    element.style.height      = scroll_height + "px";
    textarea.style.minHeight  = scroll_height + "px";
    textarea.style.height     = scroll_height + "px";
}
  getDocument(){
    this.documentProvider.ask().then((res)=>{
        this.documentLoaded =true;
        this.docData = res;
        this.document.extension = this.docData;
        this.document.hasFile = true;
        this.document.size = this.docData.metadata.size;
        this.document.extension = this.documentProvider.getExtFromMIME(this.docData.metadata.contentType);
        this.document.downloadURL = this.docData.downloadURL;
        this.document.fullPath = this.docData.ref.fullPath;
    })
  }
  editDocumentName(){
    let modal = this.modalCtrl.create(EditDocumentNamePage, {'documentName':this.document.name});
    modal.onDidDismiss((data) => {
      if(data.changed)
        this.document.name= data.documentName;
      
      })
      
    modal.present();
  }
  editTags(){
    let modal = this.modalCtrl.create(EditTagsPage, {'tags':this.document.tags});
    modal.onDidDismiss((data) => {
      if(data.changed){
        console.log(data)
        let temp = data.tags;
        this.document.tags= [];
        setTimeout(()=>{
          this.document.tags = temp;
        console.log(this.document.tags)
        })
      }
      
      })
      
    modal.present();
  }
    publier() {
      this.document.date = new Date().toISOString();
      this.documentProvider.addDocument(this.document).then(()=>{

      }).catch((eer)=>{

      })
      this.viewCtrl.dismiss();
  }

  

  dismiss() {
   this.viewCtrl.dismiss();
   if(this.documentLoaded){
     this.documentProvider.deleteFile(this.docData.ref.fullPath).then(()=>{}).catch((err)=>{

   })
   }
  }

}
