var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component } from '@angular/core';
import { FileTransfer } from '@ionic-native/file-transfer';
import { Platform, NavController, AlertController } from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { ThemeableBrowser } from '@ionic-native/themeable-browser';
var PDFModel = (function () {
    function PDFModel(title, location) {
        this.location = location;
        this.title = title;
    }
    return PDFModel;
}());
var DocumentPage = DocumentPage_1 = (function () {
    function DocumentPage(navCtrl, platform, alertCtrl, themeBrowser) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.platform = platform;
        this.alertCtrl = alertCtrl;
        this.themeBrowser = themeBrowser;
        this.storageDirectory = '';
        this.onlineLocation = 'http://cdi.x10.mx/api/download/documents/doc.pdf';
        this.platform.ready().then(function () {
            if (!_this.platform.is('cordova')) {
                return false;
            }
            //Platform check to determine storage directory prefix
            if (_this.platform.is('ios')) {
                _this.storageDirectory = cordova.file.documentsDirectory;
            }
            else if (_this.platform.is('android')) {
                _this.storageDirectory = cordova.file.dataDirectory;
            }
            else {
                return false;
            }
            _this.platform.ready().then(function () {
                // File Transfer Code - Getting the file from it's online location and
                // creating a local copy for offline functionality
                var transfer = new FileTransfer();
                var fileTransfer = transfer.create();
                ;
                console.log(_this.storageDirectory);
                console.log("folder ios " + cordova.file.documentsDirectory);
                fileTransfer.download(_this.onlineLocation, _this.storageDirectory + "pdf.pdf", true).then(function (entry) {
                    _this.OnlineToggle = true;
                    // A Little Alert for when the PDF has been downloaded.  Useful for troubleshooting.
                    var alertSuccess = _this.alertCtrl.create({
                        title: 'Download Succeeded!',
                        subTitle: 'pdf.pdf was successfully download to:' + entry.toURL(),
                        buttons: ['OK']
                    });
                    alertSuccess.present();
                    var temp = new PDFModel("Document", entry.toURL());
                    console.log(temp.location + " location!");
                    console.log(temp.title + " title!");
                    _this.pdf = { location: entry.toURL(), title: "Document" };
                }, function (error) {
                    _this.pdf = { location: "filesystem:file:///persistent/pdf.pdf", title: "Document" };
                    console.log("error", error);
                    var alertFailure = _this.alertCtrl.create({
                        title: 'Download failed!',
                        subTitle: '${image} was not successfully downloaded. Error code: ${error.code}',
                        buttons: ['Ok']
                    });
                    alertFailure.present();
                });
            });
        });
    }
    DocumentPage.prototype.open_siteweartspdf = function () {
        // The Sitewearts Document viewer starts with a JSON encoded string.  This has
        // options for features such as print and bookmark.  Not all are ready for all
        // platforms.
        var options = {
            "title": "pdf",
            "documentView": {
                "closeLabel": "Close Document"
            },
            "navigationView": {
                "closeLabel": "Close Navigation"
            },
            "openwith": {
                "enabled": "true"
            },
            "save": {
                "enabled": "true"
            },
            // "print" : {
            //   "enabled" : "true"
            // },
            // "bookmarks" : {
            //   "enabled" : "true"
            // },
            "search": {
                "enabled": "true"
            },
            "email": {
                "enabled": "true"
            }
        };
        var tempLocation = this.OnlineToggle ? this.onlineLocation : this.pdf.location;
        if (this.platform.is('ios')) {
            //Works great when the document is local on ios
            if (this.OnlineToggle) {
                var alertFailure = this.alertCtrl.create({
                    title: 'Not Supported',
                    subTitle: 'Sitewaerts Document Viewer Does not support online viewing', buttons: ['Ok']
                });
                alertFailure.present();
            }
            else {
                //Notice all the extra functions that it requires
                cordova.plugins.SitewaertsDocumentViewer.viewDocument(tempLocation, 'application/pdf', options, this.onShow(tempLocation), this.onClose, this.onMissingApp, this.onError);
            }
        }
        else if (this.platform.is('android')) {
            //On Android the app will throw to another app to view the PDF
            var alertFailure = this.alertCtrl.create({
                title: 'Problem!',
                subTitle: 'The Document Viewer on Android throws to another app because of copyright issues.', buttons: ['Ok']
            });
            //alertFailure.present();
            cordova.plugins.SitewaertsDocumentViewer.viewDocument(tempLocation, 'application/pdf', options, this.onShow(tempLocation), this.onClose, this.onMissingApp, this.onError);
        }
    };
    DocumentPage.prototype.onShow = function (location) {
        console.log('Showing file at:' + location);
    };
    DocumentPage.prototype.onClose = function () {
        console.log('document closed');
    };
    DocumentPage.prototype.onPossible = function () {
        console.log("Document can be shown");
    };
    DocumentPage.prototype.onMissingApp = function (appId, installer) {
        if (confirm("Do you want to install the free PDF Viwer App" + appId + " for Android?")) {
            installer();
        }
    };
    DocumentPage.prototype.onImpossible = function () {
        console.log('Document can not be shown');
    };
    DocumentPage.prototype.onError = function (error) {
        console.log(error);
        console.log("ERROR: CANNOT SHOW DOCUMENT");
    };
    DocumentPage.prototype.open_inAppBrowser = function () {
        // The standard option of ionic
        var tempLocation = this.OnlineToggle ? this.onlineLocation : this.pdf.location;
        // The Option enableViewportScale=yes is the one that enables native gestures
        if (this.platform.is('ios')) {
            var iab = new InAppBrowser();
            var browser = iab.create(tempLocation, '_blank', 'location=yes, enableViewportScale=yes');
            //let browser = new InAppBrowser(tempLocation, '_blank', 'location=yes, enableViewportScale=yes');
            browser.show();
        }
        else if (this.platform.is('android')) {
            // With the InAppBrowser on Android it is possible to view online documents by
            // prefixing the location with the google prefix and encoding the location
            // with encodeURIComponent()
            if (this.OnlineToggle) {
                tempLocation = DocumentPage_1.googleUrlPrefix + encodeURIComponent(tempLocation);
                var iab = new InAppBrowser();
                var browser = iab.create(tempLocation, '_blank', 'location=yes, enableViewportScale=yes');
                // let browser = new InAppBrowser(tempLocation, '_blank', 'location=yes, enableViewportScale=yes');
                browser.show();
            }
            else {
                //inAppBrowser does not support the viewing of offline documents with inAppBrowser
                var alertFailure = this.alertCtrl.create({
                    title: 'Problem!',
                    subTitle: 'InAppBrowser can\'t open offline PDF\'s on an Android device', buttons: ['Ok']
                });
                alertFailure.present();
            }
        }
    };
    DocumentPage.prototype.open_themeable_pdf = function () {
        // Basically the same logic as the inAppBrowser.  The browser works great
        // on ios, but on Android it can only open an online document with the
        // google prefix and can't open Android offline documents.
        var tempLocation = this.OnlineToggle ? this.onlineLocation : this.pdf.location;
        if (this.platform.is('ios')) {
            this.themeableBrowser(tempLocation);
        }
        else if (this.platform.is('android')) {
            if (this.OnlineToggle) {
                this.themeableBrowser(DocumentPage_1.googleUrlPrefix + encodeURIComponent(tempLocation));
            }
            else {
                var alertFailure = this.alertCtrl.create({
                    title: 'Problem!',
                    subTitle: 'ThemeableBrowser can\'t open offline PDF\'s on an Android device', buttons: ['Ok']
                });
                alertFailure.present();
            }
        }
    };
    DocumentPage.prototype.themeableBrowser = function (location) {
        // The setup for themeableBrowser.  To implement custom buttons add a button
        // to the customButtons array.  Then add a listener as shown below.
        var baseConfig = {
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
        var browser = this.themeBrowser.create(location, '_blank', baseConfig);
        // let browser = cordova.ThemeableBrowser.open(location, '_blank', baseConfig);
        browser.on('backPressed').subscribe(function () {
            alert('Back pressed');
        });
        browser.on('helloPressed').subscribe(function () {
            alert('hello pressed');
        });
        browser.on('locationPressed').subscribe(function () {
            alert(location);
        });
        browser.on('ThemeableBrowserError').subscribe(function (e) {
            console.error(e.message);
        });
        browser.on('ThemeableBrowserWarning').subscribe(function (e) {
            console.error(e.message);
        });
    };
    DocumentPage.prototype.openAndroidPDF = function () {
        var tempLocation = this.OnlineToggle ? this.onlineLocation : this.pdf.location;
        var options = {
            headerColor: "#000000",
            showScroll: true
        };
        if (this.platform.is('ios')) {
            var alertFailure = this.alertCtrl.create({
                title: 'Problem!',
                subTitle: 'The Android Document Viewer doesn\'t work on iOS.  Shocking.', buttons: ['Ok']
            });
            alertFailure.present();
        }
        else if (this.platform.is('android')) {
            // AndroidNativePdfViewer.openPdfUrl(tempLocation, this.pdf.title, options,
            // function(success){
            // console.log(tempLocation)
            // }, function(error){
            console.log("It didn't work!");
            // });
        }
    };
    return DocumentPage;
}());
DocumentPage.googleUrlPrefix = 'https://docs.google.com/gview?embedded=true&url=';
DocumentPage = DocumentPage_1 = __decorate([
    Component({
        selector: 'page-document',
        templateUrl: 'document.html',
    }),
    __metadata("design:paramtypes", [NavController, Platform, AlertController, ThemeableBrowser])
], DocumentPage);
export { DocumentPage };
var DocumentPage_1;
//# sourceMappingURL=document.js.map