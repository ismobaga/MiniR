import { Component, ViewChild, ElementRef } from '@angular/core';
import { ModalController, ViewController, LoadingController, NavController, NavParams } from 'ionic-angular';
import { DocumentProvider } from '../../../providers/document/document';
import { QRCodePage } from '../qr-code/qr-code';
import { ImageViewerController } from 'ionic-img-viewer';

/**
 * Generated class for the EditNamePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-document-detail',
  templateUrl: 'document-detail.html',
})
export class DocumentDetailPage {
  document:any;
    public like_btn = {
    color: 'black',
    icon_name: 'ios-thumbs-up-outline',
    icon_name_liked : 'thumbs-up',
     color_liked : 'danger'
  };
  liked:boolean;
  noLike:number;
    @ViewChild('myImage') myImage: ElementRef;

  constructor(
  	public navCtrl: NavController,
  	public navParams: NavParams,
  	public viewCtrl: ViewController,
    public loadingCtrl: LoadingController,
    public documentProvider:  DocumentProvider,
        public imageViewerCtrl: ImageViewerController,

    public modalCtrl: ModalController
    ) {
    this.document = {color:'red',
                     authorUid:"Qnh1a3hqFnha15YJGhIwGVG86fA3",
                     date:"2017-09-06T00:21:10.454Z",
                     downloadURL:"https://firebasestorage.googleapis.com/v0/b/cdi-mini.appspot.com/o/documents%2FQnh1a3hqFnha15YJGhIwGVG86fA3%2Fdocs64ac4bcea9-f64ea-a9d31-def8a-9cbf6ae1877cb62?alt=media&token=598e4eee-c54f-44b8-af81-369d8aa9b501",
                     extension:"EXT",
                     fullPath:"documents/Qnh1a3hqFnha15YJGhIwGVG86fA3/docs64ac4bcea9-f64ea-a9d31-def8a-9cbf6ae1877cb62",
                     hasFile:true,
                     liked:false,
                     merci:1,
                     merciArray:{Qnh1a3hqFnha15YJGhIwGVG86fA3: "Qnh1a3hqFnha15YJGhIwGVG86fA3"},
                     name:"Emplo du temps",
                     size:242200,
                     tags:[{display: "...", value: "..."},{display: "..", value: ".."}],
                     text:"                           ",
                     views:0,
                     author:{
                       displayName:"name ..",
                       photoURL:""
                     }
                   }

  }
    myImageSrc;
  opendDocument(document:any){
    let img = this.myImage.nativeElement.querySelector('img','.thumb-img')
    let modal;
    // let img =Array()
    // img[0]=document.downloadURL;
    this.myImageSrc = document.downloadURL;
    if(document.hasFile)
    {
      // modal = this.modalCtrl.create(ImageViewer, {'images': img}); 
      modal = this.imageViewerCtrl.create(img)  
    }
    modal.present();
  }
  toUpper(str:string){
    return str.toUpperCase();
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad EditNamePage');

    this.documentProvider.getDocument(this.navParams.data.key).once('value').then((data) => {
      this.document = data.val();
      this.document.author={
                       displayName:"name ..",
                       photoURL:""
                     }
      this.documentProvider.getUser(this.document.authorUid).once('value').then(author=>{
        this.document.author = author.val();
      });
      console.log(this.document.author)
      this.liked = this.document.liked;
      this.noLike = this.document.merci;
      console.log(this.document);
    });
  }
  likeButton(key) {
   if(this.liked){
     this.noLike--;
     this.liked = false;
   }
   else{
     this.noLike++;
     this.liked = true; 
   }

    this.documentProvider.like(this.navParams.data.key, this.navParams.data.uid);
  }

   qrCode(){
     console.log(this.navParams.get('key'))
     let modal = this.modalCtrl.create(QRCodePage, {type: 'document', ref:'documents', key:this.navParams.get('key'), title:''});
    modal.present();

 }

  dismiss() {
   this.viewCtrl.dismiss();
  }

}
