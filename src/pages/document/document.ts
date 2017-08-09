import { Component } from '@angular/core';
import { File } from '@ionic-native/file';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { Platform, NavController, NavParams, AlertController } from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { ThemeableBrowser, ThemeableBrowserObject, ThemeableBrowserOptions } from '@ionic-native/themeable-browser';
//import { PdfDisplayPage } from '../pdf-display/pdf-display';
// import  AndroidNativePdfViewer  from 'AndroidNativePdfViewer';
declare var cordova: any;
declare var AndroidNativePdfViewer: any;

class PDFModel {
  public location:string;
  public title:string;
  constructor(title, location) {
    this.location =location;
    this.title = title;
  }
}
@Component({
  selector: 'page-document',
  templateUrl: 'document.html',
})
export class DocumentPage {

 static readonly googleUrlPrefix = 'https://docs.google.com/gview?embedded=true&url=';
  storageDirectory: string = '';
  pdf: any;
  OnlineToggle: boolean;
  onlineLocation ='http://cdi.x10.mx/api/download/documents/doc.pdf';

  constructor(public navCtrl: NavController, public platform:Platform, public alertCtrl: AlertController, public themeBrowser: ThemeableBrowser) {

    this.platform.ready().then(() => {
      if(!this.platform.is('cordova')){
        return false;
      }


      //Platform check to determine storage directory prefix
      if (this.platform.is('ios')) {
        this.storageDirectory = cordova.file.documentsDirectory;
      } else if(this.platform.is('android')) {
        this.storageDirectory = cordova.file.dataDirectory;
      } else {
        return false;
      }

      this.platform.ready().then(() => {
        // File Transfer Code - Getting the file from it's online location and
        // creating a local copy for offline functionality
        let transfer = new FileTransfer();
        const fileTransfer = transfer.create();;
        console.log(this.storageDirectory);
        console.log("folder ios "+cordova.file.documentsDirectory);

        fileTransfer.download(this.onlineLocation, this.storageDirectory + "pdf.pdf", true).then((entry) => {
          this.OnlineToggle = true;

          // A Little Alert for when the PDF has been downloaded.  Useful for troubleshooting.
         const alertSuccess = this.alertCtrl.create({
             title: 'Download Succeeded!',
             subTitle: 'pdf.pdf was successfully download to:' + entry.toURL(),
             buttons: ['OK']
           });
          alertSuccess.present();

          let temp = new PDFModel( "Document", entry.toURL() );
          console.log(temp.location + " location!");
          console.log(temp.title + " title!")
          this.pdf = {location: entry.toURL(), title: "Document"};

        }, (error) => {
          this.pdf = {location: "filesystem:file:///persistent/pdf.pdf", title: "Document"};
          console.log("error", error);
          const alertFailure = this.alertCtrl.create({
            title: 'Download failed!',
            subTitle: '${image} was not successfully downloaded. Error code: ${error.code}',
            buttons: ['Ok']
          });
          alertFailure.present();
        });
      });
    })
  }

  open_siteweartspdf( ){
    // The Sitewearts Document viewer starts with a JSON encoded string.  This has
    // options for features such as print and bookmark.  Not all are ready for all
    // platforms.

    var options = {
      "title": "pdf",
      "documentView" : {
        "closeLabel" : "Close Document"
      },
      "navigationView" : {
        "closeLabel" : "Close Navigation"
      },
      "openwith" : {
        "enabled": "true"
      },
      "save" : {
        "enabled" : "true"
      },
      // "print" : {
      //   "enabled" : "true"
      // },
      // "bookmarks" : {
      //   "enabled" : "true"
      // },
      "search" : {
        "enabled" : "true"
      },
      "email" : {
        "enabled" : "true"
      }
    }

    let tempLocation = this.OnlineToggle ? this.onlineLocation : this.pdf.location;

    if(this.platform.is('ios')) {
      //Works great when the document is local on ios

      if (this.OnlineToggle) {
        const alertFailure = this.alertCtrl.create({
          title: 'Not Supported',
          subTitle: 'Sitewaerts Document Viewer Does not support online viewing' ,buttons: ['Ok']
        });
        alertFailure.present();
      } else {
        //Notice all the extra functions that it requires
        cordova.plugins.SitewaertsDocumentViewer.viewDocument(tempLocation, 'application/pdf', options, this.onShow(tempLocation), this.onClose, this.onMissingApp, this.onError);
      }
    } else if(this.platform.is('android')) {
      //On Android the app will throw to another app to view the PDF
      const alertFailure = this.alertCtrl.create({
        title: 'Problem!',
        subTitle: 'The Document Viewer on Android throws to another app because of copyright issues.' ,buttons: ['Ok']
      });
      //alertFailure.present();
        cordova.plugins.SitewaertsDocumentViewer.viewDocument(tempLocation, 'application/pdf', options, this.onShow(tempLocation), this.onClose, this.onMissingApp, this.onError);
    }

  }

  onShow(location){
    console.log('Showing file at:' + location);
  }

  onClose(){
    console.log('document closed');
  }

  onPossible(){
    console.log("Document can be shown");
  }

  onMissingApp(appId, installer){
    if(confirm("Do you want to install the free PDF Viwer App" + appId + " for Android?")){
      installer();
    }
  }

  onImpossible(){
    console.log('Document can not be shown');
  }

  onError(error){
    console.log(error);
    console.log("ERROR: CANNOT SHOW DOCUMENT");
  }

  open_inAppBrowser(){
    // The standard option of ionic

    let tempLocation = this.OnlineToggle ? this.onlineLocation : this.pdf.location;

    // The Option enableViewportScale=yes is the one that enables native gestures

    if(this.platform.is('ios')) {
      let iab = new InAppBrowser();
      let browser =  iab.create(tempLocation, '_blank', 'location=yes, enableViewportScale=yes');
      //let browser = new InAppBrowser(tempLocation, '_blank', 'location=yes, enableViewportScale=yes');
      browser.show();

    } else if(this.platform.is('android')) {

      // With the InAppBrowser on Android it is possible to view online documents by
      // prefixing the location with the google prefix and encoding the location
      // with encodeURIComponent()

      if(this.OnlineToggle){
        tempLocation = DocumentPage.googleUrlPrefix + encodeURIComponent(tempLocation);
      let iab = new InAppBrowser();
      let browser =  iab.create(tempLocation, '_blank', 'location=yes, enableViewportScale=yes');

        // let browser = new InAppBrowser(tempLocation, '_blank', 'location=yes, enableViewportScale=yes');
        browser.show();

      } else {
        //inAppBrowser does not support the viewing of offline documents with inAppBrowser
        const alertFailure = this.alertCtrl.create({
          title: 'Problem!',
          subTitle: 'InAppBrowser can\'t open offline PDF\'s on an Android device' ,buttons: ['Ok']
        });
        alertFailure.present();
      }
    }
  }

  open_themeable_pdf(){
    // Basically the same logic as the inAppBrowser.  The browser works great
    // on ios, but on Android it can only open an online document with the
    // google prefix and can't open Android offline documents.

    let tempLocation = this.OnlineToggle ? this.onlineLocation : this.pdf.location;

    if(this.platform.is('ios')) {

      this.themeableBrowser(tempLocation);

    } else if(this.platform.is('android')) {

      if(this.OnlineToggle){

        this.themeableBrowser(DocumentPage.googleUrlPrefix + encodeURIComponent(tempLocation));

      } else {
        const alertFailure = this.alertCtrl.create({
          title: 'Problem!',
          subTitle: 'ThemeableBrowser can\'t open offline PDF\'s on an Android device' ,buttons: ['Ok']
        });
        alertFailure.present();
      }
    }
  }

  themeableBrowser(location){
    // The setup for themeableBrowser.  To implement custom buttons add a button
    // to the customButtons array.  Then add a listener as shown below.

    const baseConfig = {
      toolbar: {
        height: 44,
        color: '#004a8b'
      },
      closeButton: {
        wwwImage: 'assets/icon/back_small.png',
        wwwImageDensity: 2,
        align: 'left',
        event: 'closePressed'
      },
      // customButtons: [
      //   {
      //        image: 'share',
      //        imagePressed: 'share_pressed',
      //        align: 'right',
      //        event: 'sharePressed'
      //    }
      // ],
      menu: {
        wwwImage: 'assets/icon/more_small.png',
        wwwImageDensity: 2,
        align: 'right',
        cancel: 'Cancel',
        items: [
          {
            event: 'helloPressed',
            label: 'Hello World!'
          },
          {
            event: 'locationPressed',
            label: 'Location of PDF'
          },
        ]

      },
      backButtonCanClose: false
    };

    // Although it seems counter-intutitve, open the browser first, then create
    // listeners.
    const browser: ThemeableBrowserObject = this.themeBrowser.create(location, '_blank', baseConfig);
    // let browser = cordova.ThemeableBrowser.open(location, '_blank', baseConfig);

    browser.on('backPressed').subscribe(() =>{
       alert('Back pressed');
    });

    browser.on('helloPressed').subscribe(() => {
      alert('hello pressed');
    });

    browser.on('locationPressed').subscribe(()=> {
      alert(location);
    });

    browser.on('ThemeableBrowserError').subscribe((e) => {
      console.error(e.message);
    });
    browser.on('ThemeableBrowserWarning').subscribe((e) => {
      console.error(e.message);
    });


  }

  openAndroidPDF(){
    let tempLocation = this.OnlineToggle ? this.onlineLocation : this.pdf.location;

    var options = {
      headerColor:"#000000",
      showScroll:true
    }

    if(this.platform.is('ios')) {
      const alertFailure = this.alertCtrl.create({
        title: 'Problem!',
        subTitle: 'The Android Document Viewer doesn\'t work on iOS.  Shocking.' ,buttons: ['Ok']
      });
      alertFailure.present();
    } else if(this.platform.is('android')) {
      // AndroidNativePdfViewer.openPdfUrl(tempLocation, this.pdf.title, options,
        // function(success){
          // console.log(tempLocation)
        // }, function(error){
          console.log("It didn't work!")
        // });
    }
  }

}
