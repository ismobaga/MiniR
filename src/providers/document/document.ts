import { Injectable } from '@angular/core';
import { ActionSheetController } from 'ionic-angular'
import 'rxjs/add/operator/map';
import firebase from 'firebase';
import { Camera } from '@ionic-native/camera';
import { AngularFireDatabase } from 'angularfire2/database';
import { OnlineProvider } from '../onlineProvider';



@Injectable()
export class DocumentProvider {
  fireStore = firebase.storage();

  constructor(public camera:Camera, public actionSheetCtrl:ActionSheetController, public afdatabase: AngularFireDatabase, public onlineProv:OnlineProvider) {
    console.log('Hello DocumentProvider Provider');
  }

  ask(){
  	return new Promise((resolve, reject) => {
      let actionSheet = this.actionSheetCtrl.create({

        buttons: [
        {
          text: 'Choisir',
          handler: () => {
            this.storeImg(this.camera.PictureSourceType.PHOTOLIBRARY).then((res)=>{
              resolve(res);
            });
          }
        },{
          text: 'Prendre',
          handler: () => {
            this.storeImg(this.camera.PictureSourceType.CAMERA).then((res)=>{
              resolve(res);
            });
          }
        },{
          text: 'Importer de...',
          handler: () => {
          	// this.storeImg(this.camera.PictureSourceType.PHOTOLIBRARY).then((url)=>{
              // });
            }
          },{
            text: 'Annuler',
            role: 'cancel',
            handler: () => {
            }
          }
          ]
        });
      actionSheet.present();
    });
  }
  image;
  error;

  storeImg(type){
    return new Promise((resolve, reject) => {
      this.camera.getPicture({
        sourceType: type,
        destinationType: this.camera.DestinationType.DATA_URL,
        quality: 100,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE,
      }).then(imageData => {
        this.image = 'data:image/jpeg;base64,' + imageData;
        let uuid =this.guid();
        let imageStore = this.fireStore.ref('documents').child(firebase.auth().currentUser.uid).child('docs'+uuid);

        imageStore.putString(this.image, 'data_url').then((res)=> {
          resolve(res)
          res.ref.fullPath

        }).catch((err)=>{
          reject(err);
        })
      }, error => {
        this.error = JSON.stringify(error);
      });
    }
    );
  }
  guid(){
    function s4() {
      return Math.floor((1+ Math.random())*0x100000).toString(16).substring(1);
    }
    return s4()+s4()+'-'+ s4()+'-'+s4()+'-'+s4()+'-'+s4()+s4()+s4();
  }

  deleteFile(fullPath){
    return  this.fireStore.ref(fullPath).delete();
  }

  addDocument(document){
        document.authorUid= firebase.auth().currentUser.uid;
        let currentUserRef = this.afdatabase.list('/documents/')
        return currentUserRef.push(document);
    }

  dismiss() {
    // this.viewCtrl.dismiss();
  }

    types = {
      'text/html'                             :'html',
      'text/css'                              :'css',
      'text/xml'                              :'xml',
      'image/gif'                             :'gif',
      'image/jpeg'                            :'jpg',
      'application/x-javascript'              :'js',
      'application/atom+xml'                  :'atom',
      'application/rss+xml'                   :'rss',

      'text/mathml'                           :'mml',
      'text/plain'                            :'txt',
      'text/vnd.sun.j2me.app-descriptor'      :'jad',
      'text/vnd.wap.wml'                      :'wml',
      'text/x-component'                      :'htc',

      'image/png'                             :'png',
      'image/tiff'                            :'tiff',
      'image/vnd.wap.wbmp'                    :'wbmp',
      'image/x-icon'                          :'ico',
      'image/x-jng'                           :'jng',
      'image/x-ms-bmp'                        :'bmp',
      'image/svg+xml '                        :'svg',
      'image/webp'                            :'webp',
      'application/java-archive'              :'jar',
      'application/mac-binhex40 '             :'hqx',
      'application/msword'                    :'doc',
      'application/pdf'                       :'pdf',
      'application/postscript'                :'ps',
      'application/rtf'                       :'rtf',
      'application/vnd.ms-excel'              :'xls',
      'application/vnd.ms-powerpoint'         :'ppt',
      'application/vnd.wap.wmlc'              :'wmlc',
      'application/vnd.google-earth.kml+xml'  :'kml',
      'application/vnd.google-earth.kmz'      :'kmz',
      'application/x-7z-compressed'           :'7z',
      'application/x-cocoa'                   :'cco',
      'application/x-java-archive-diff'       :'jardiff',
      'application/x-java-jnlp-file'          :'jnlp',
      'application/x-makeself'                :'run',
      'application/x-perl'                    :'pl',
      'application/x-pilot'                   :'prc',
      'application/x-rar-compressed'          :'rar',
      'application/x-redhat-package-manager'  :'rpm',
      'application/x-sea'                     :'sea',
      'application/x-shockwave-flash'         :'swf',
      'application/x-stuffit'                 :'sit',
      'application/x-tcl'                     :'tcl',
      'application/x-x509-ca-cert'            :'der',
      'application/x-xpinstall'               :'xpi',
      'application/xhtml+xml'                 :'xhtml',
      'application/zip'                       :'zip',
    }


  getExtFromMIME(contentType:string){
    if(this.types[contentType]){
      let temp:string =this.types[contentType]
      return temp.toUpperCase();
  }
  return 'N/A';
}

getDocuments(){
      return this.afdatabase.list('/documents/');
    }
getDocument(key){
      return this.afdatabase.database.ref('/documents/').child(key);
    }
getUserDocument(uid){
      return 0;//this.afdatabase.list('/documents/'+key);
    }
  getUser(uid){
        return this.onlineProv.getUser(uid);
    }
    like(key, userId){
      this.dejaDisMerci(key, userId)
    }
    likeUnlike(key, userId:string, dejaLike){
let doc = this.afdatabase.object('/documents/'+key);
if(dejaLike){
  doc.$ref.once('value').then(snapshot =>{
    let obj = snapshot.val();
    doc.update({merci: obj.merci -1});
    let merciTD = this.afdatabase.object('/documents/'+key+'/merciArray/'+userId).remove();
    let merciArray = obj.merciArray
    console.log('merciAra unlike', merciArray)
    
  })
}
else{
    doc.$ref.once('value').then(snapshot =>{
    let obj = snapshot.val();
    doc.update({merci: obj.merci +1});
    doc.$ref.child('merciArray').update({[userId]:userId});
    let merciArray = obj.merciArray
    console.log('merciAra', merciArray)

  })
}
    }
    dejaDisMerci(key, userId){
      let dejaLike = false
      let DocRef = this.afdatabase.object('/documents/'+key+'/merciArray/'+userId).$ref.once('value').then((result)=>{
        console.log(result)
        if(result.node_.value_){
          dejaLike = true;
        }
        else{
          dejaLike = false
        }
        this.likeUnlike(key, userId, dejaLike);

        
      })
    }


}
