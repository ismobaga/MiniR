var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, ViewChild } from '@angular/core';
import { NavController, LoadingController, App, Content, PopoverController, AlertController } from 'ionic-angular';
import { DocumentViewer } from '@ionic-native/document-viewer';
import { PostPopover } from './post-popover';
import { MessagePage } from '../message/message';
import { WelcomePage } from '../welcome/welcome';
import { AuthService } from '../../providers/auth-service/auth-service';
import { File } from '@ionic-native/file';
import { FileTransfer } from '@ionic-native/file-transfer';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
var HomePage = (function () {
    function HomePage(navCtrl, popoverCtrl, document, app, authService, file, barcodeScanner, loadingCtrl, alertCtrl, transfer) {
        this.navCtrl = navCtrl;
        this.popoverCtrl = popoverCtrl;
        this.document = document;
        this.app = app;
        this.authService = authService;
        this.file = file;
        this.barcodeScanner = barcodeScanner;
        this.loadingCtrl = loadingCtrl;
        this.alertCtrl = alertCtrl;
        this.transfer = transfer;
        this.like_btn = {
            color: 'black',
            icon_name: 'heart-outline'
        };
        this.tap = 0;
        this.userPostData = { "user_id": "", "token": "" };
        this.fileTransfer = this.transfer.create();
        if (JSON.parse(localStorage.getItem('userData'))) {
            var data = JSON.parse(localStorage.getItem('userData'));
            this.userDetails = data.userData;
            this.userPostData.user_id = this.userDetails.id;
            this.userPostData.token = this.userDetails.token;
            this.getDocuments();
        }
        else {
            this.navCtrl.push(WelcomePage);
        }
    }
    HomePage.prototype.getDocuments = function () {
        var _this = this;
        var loader = this.loadingCtrl.create({
            duration: 200
        });
        loader.present();
        this.authService.postData(this.userPostData, 'documents')
            .then(function (result) {
            _this.responseData = result;
            if (_this.responseData.documentsData) {
                _this.dataSet = _this.responseData.documentsData;
            }
            else { }
        }, function (err) {
        });
    };
    HomePage.prototype.convertTime = function (created) {
        var date = new Date(created);
        return date;
    };
    HomePage.prototype.toUpper = function (str) {
        return str.toUpperCase();
    };
    HomePage.prototype.goMessages = function () {
        this.app.getRootNav().push(MessagePage);
    };
    HomePage.prototype.goCodeScanner = function () {
        var _this = this;
        console.log("Scanner Camera");
        var loader = this.loadingCtrl.create({
            duration: 200
        });
        var result;
        loader.present();
        this.barcodeScanner.scan().then(function (barcodeData) {
            console.log(barcodeData);
            result = JSON.stringify(barcodeData);
            var alertFailure = _this.alertCtrl.create({
                title: 'Resultat!',
                subTitle: result, buttons: ['Ok']
            });
            alertFailure.present();
        }, function (err) {
            console.log("Error:", err);
            var alertFailure = _this.alertCtrl.create({
                title: 'Resultat!',
                subTitle: result, buttons: ['Ok']
            });
            alertFailure.present();
        });
    };
    HomePage.prototype.swipePage = function (event) {
        console.log(event.direction);
        if (event.direction === 4) {
            console.log("Swap Camera");
            this.goCodeScanner();
        }
        if (event.direction === 2) {
            this.goMessages();
        }
    };
    HomePage.prototype.tapPhotoLike = function (times) {
        this.tap++;
        if (this.tap % 2 === 0) {
            this.likeButton();
        }
    };
    HomePage.prototype.viewFile = function (url, type) {
        var options = {
            title: 'My Viewer'
        };
        var pathto = this.downloadFile(url);
        console.log(this.file.dataDirectory + 'file.pdf');
        console.log('Viewer');
        this.document.viewDocument(this.file.dataDirectory + 'file.pdf', 'application/pdf', options);
    };
    HomePage.prototype.downloadFile = function (url) {
        this.fileTransfer.download(url, "file:///persistent/file.pdf", true).then(function (entry) {
            console.log('download complete: ' + entry.toURL());
            console.log("entry", entry);
            return entry;
        }, function (error) {
            // handle error
        });
    };
    HomePage.prototype.presentPostPopover = function () {
        var popover = this.popoverCtrl.create(PostPopover);
        popover.present();
    };
    HomePage.prototype.likeButton = function () {
        if (this.like_btn.icon_name === 'heart-outline') {
            this.like_btn.icon_name = 'heart';
            this.like_btn.color = 'danger';
            // Do some API job in here for real!
        }
        else {
            this.like_btn.icon_name = 'heart-outline';
            this.like_btn.color = 'black';
        }
    };
    return HomePage;
}());
__decorate([
    ViewChild(Content),
    __metadata("design:type", Content)
], HomePage.prototype, "content", void 0);
HomePage = __decorate([
    Component({
        selector: 'page-home',
        templateUrl: 'home.html'
    }),
    __metadata("design:paramtypes", [NavController,
        PopoverController,
        DocumentViewer,
        App,
        AuthService,
        File,
        BarcodeScanner,
        LoadingController,
        AlertController,
        FileTransfer])
], HomePage);
export { HomePage };
//# sourceMappingURL=home.js.map