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
import { NavController, NavParams, ActionSheetController, ToastController, Platform, App, AlertController, LoadingController, ModalController } from 'ionic-angular';
import { EditNamePage } from '../modal/edit-name/edit-name';
import { EditAnneePage } from '../modal/edit-annee/edit-annee';
import { DocumentDetailPage } from '../modal/document-detail/document-detail';
import { WelcomePage } from '../welcome/welcome';
import { File } from '@ionic-native/file';
import { Transfer } from '@ionic-native/transfer';
import { FilePath } from '@ionic-native/file-path';
import { Camera } from '@ionic-native/camera';
import { AuthService } from '../../providers/auth-service/auth-service';
var ProfilePage = (function () {
    function ProfilePage(navCtrl, navParams, camera, transfer, file, filePath, actionSheet, toastCtrl, platform, loadingCtrl, app, alertCtrl, modalCtrl, authService) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.camera = camera;
        this.transfer = transfer;
        this.file = file;
        this.filePath = filePath;
        this.actionSheet = actionSheet;
        this.toastCtrl = toastCtrl;
        this.platform = platform;
        this.loadingCtrl = loadingCtrl;
        this.app = app;
        this.alertCtrl = alertCtrl;
        this.modalCtrl = modalCtrl;
        this.authService = authService;
        this.lastImage = null;
        this.bgImage = "http://cdi.x10.mx/files/images/logo.png";
        this.userPostData = { "user_id": "", "token": "" };
        this.storageDirectory = '';
        if (JSON.parse(localStorage.getItem('userData'))) {
            var data = JSON.parse(localStorage.getItem('userData'));
            this.userDetails = data.userData;
            this.userPostData.user_id = this.userDetails.id;
            this.userPostData.token = this.userDetails.token;
            this.getMyDocuments();
        }
        else {
            this.navCtrl.push(WelcomePage);
        }
        //Platform check to determine storage directory prefix
        if (this.platform.is('ios')) {
            this.storageDirectory = cordova.file.documentsDirectory;
        }
        else if (this.platform.is('android')) {
            this.storageDirectory = cordova.file.dataDirectory;
        }
        console.log("platform", this.platform);
    }
    ProfilePage.prototype.getMyDocuments = function () {
        var _this = this;
        this.authService.postData(this.userPostData, 'documents/' + this.userPostData.user_id)
            .then(function (result) {
            _this.responseData = result;
            if (_this.responseData.documentsData) {
                _this.documents = _this.responseData.documentsData;
                console.log(_this.documents);
            }
            else { }
        }, function (err) {
        });
    };
    ProfilePage.prototype.logout = function () {
        var _this = this;
        localStorage.clear();
        setTimeout(function () { return _this.backToWelcome(); }, 1000);
    };
    ProfilePage.prototype.backToWelcome = function () {
        var root = this.app.getRootNav();
        root.popToRoot();
    };
    ProfilePage.prototype.ionViewDidLoad = function () {
        this.profile_segment = 'timeline';
    };
    ProfilePage.prototype.doRefresh = function (refresher) {
        var _this = this;
        //console.log(refresher);
        this.authService.postData(this.userPostData, 'user/' + this.userPostData.user_id)
            .then(function (result) {
            // localStorage.removeItem('userData');
            var data = result;
            data['userData']['token'] = _this.userPostData.token;
            localStorage.setItem('userData', JSON.stringify(data));
            _this.loadFromLocal();
            _this.getMyDocuments();
        }, function (err) {
        });
        setTimeout(function () {
            refresher.complete();
        }, 1000);
    };
    ProfilePage.prototype.loadFromLocal = function () {
        var data = JSON.parse(localStorage.getItem('userData'));
        this.userDetails = data.userData;
    };
    ProfilePage.prototype.goSettingsPage = function () {
        var _this = this;
        // Open it as a modal page
        var params = this.userPostData;
        params['first_name'] = this.userDetails.first_name;
        params['last_name'] = this.userDetails.last_name;
        var modal = this.modalCtrl.create(EditNamePage, params);
        modal.onDidDismiss(function () {
            var data = JSON.parse(localStorage.getItem('userData'));
            _this.userDetails = data.userData;
            console.log(data);
        });
        modal.present();
    };
    ProfilePage.prototype.goShowDocumentDetails = function (id) {
        // Open it as a modal page
        var params = this.userPostData;
        params['first_name'] = this.userDetails.first_name;
        params['last_name'] = this.userDetails.last_name;
        var modal = this.modalCtrl.create(DocumentDetailPage, params);
        modal.present();
    };
    ProfilePage.prototype.goEditProfileName = function () {
        var _this = this;
        // Open it as a modal page
        var params = this.userPostData;
        params['first_name'] = this.userDetails.first_name;
        params['last_name'] = this.userDetails.last_name;
        var modal = this.modalCtrl.create(EditNamePage, params);
        modal.onDidDismiss(function () {
            var data = JSON.parse(localStorage.getItem('userData'));
            _this.userDetails = data.userData;
            console.log(data);
        });
        modal.present();
    };
    ProfilePage.prototype.goEditProfileAnnee = function () {
        // Open it as a modal page
        var modal = this.modalCtrl.create(EditAnneePage);
        modal.present();
    };
    ProfilePage.prototype.presentActionSheet = function () {
        var _this = this;
        var actionSheet = this.actionSheet.create({
            title: "La source de l'image",
            buttons: [
                {
                    text: "Choisir",
                    handler: function () {
                        _this.takePicture(_this.camera.PictureSourceType.PHOTOLIBRARY);
                    }
                },
                {
                    text: "Camera",
                    handler: function () {
                        _this.takePicture(_this.camera.PictureSourceType.CAMERA);
                    }
                },
                {
                    text: "Cancel",
                    role: "cancel"
                }
            ]
        });
        actionSheet.present();
    };
    ProfilePage.prototype.takePicture2 = function () {
        var _this = this;
        var options = {
            quality: 100,
        };
        this.camera.getPicture(options).then(function (imageData) {
            var fileTranfer = _this.transfer.create();
            var options1 = {
                fileKey: 'file',
                fileName: 'name.jpg',
                headers: {}
            };
            fileTranfer.upload(imageData, 'http://cdi.x10.mx/upload.php', options1)
                .then(function (data) {
                alert("success");
            }, function (err) {
                alert("error " + JSON.stringify(err));
            });
        });
    };
    ProfilePage.prototype.takePicture = function (sourceType) {
        var _this = this;
        //les options for camera
        var options = {
            quality: 100,
            sourceType: sourceType,
            saveToPhotoAlbum: false,
            correctOrientation: true
        };
        this.camera.getPicture(options).then(function (imagePath) {
            //gestion pour android
            if (_this.platform.is('android') && sourceType === _this.camera.PictureSourceType.PHOTOLIBRARY) {
                _this.filePath.resolveNativePath(imagePath)
                    .then(function (filePath) {
                    _this.log = filePath;
                    var corretPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
                    var currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
                    _this.copyFileToLocalDir(corretPath, currentName, _this.createFileName());
                });
            }
            else {
                var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
                var corretPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
                _this.log = corretPath;
                _this.copyFileToLocalDir(corretPath, currentName, _this.createFileName());
            }
        }, function (err) {
            _this.presentToast("Erreur lors de la selection d'image");
        });
    };
    ProfilePage.prototype.copyFileToLocalDir = function (namePath, currentPath, newFileName) {
        var _this = this;
        this.file.copyFile(namePath, currentPath, this.storageDirectory, newFileName).then(function (success) {
            _this.lastImage = newFileName;
            _this.bgImage = _this.pathForImage(newFileName);
            _this.presentToast("Sauvegarde reusit");
            var alertFailure = _this.alertCtrl.create({
                title: 'Download Success!',
                subTitle: _this.bgImage,
                buttons: ['Ok']
            });
            alertFailure.present();
        }, function (error) {
            _this.presentToast("Erreur lors de la sauvegarde");
        });
    };
    ProfilePage.prototype.presentToast = function (text) {
        var toast = this.toastCtrl.create({
            message: text,
            duration: 3000,
            position: 'top'
        });
        toast.present();
    };
    ProfilePage.prototype.pathForImage = function (img) {
        if (img === null) {
            return '';
        }
        else {
            return this.storageDirectory + img;
        }
    };
    ProfilePage.prototype.uploadImage = function () {
        var _this = this;
        var url = "http://urlto./upload.php";
        var targetPath = this.pathForImage(this.lastImage);
        //file name
        var filename = this.lastImage;
        var options = {
            fileKey: "file",
            fileName: filename,
            chunkedMode: false,
            mimeType: "multipart/form-data",
            params: { 'filename': filename }
        };
        var fileTransfer = this.transfer.create();
        this.loading = this.loadingCtrl.create({
            content: 'Cargement...',
        });
        this.loading.present();
        fileTransfer.upload(targetPath, url, options).then(function (data) {
            _this.loading.dismissAll();
            console.log(data);
            _this.presentToast('Image charger avec successs');
        }, function (err) {
            _this.loading.dismissAll();
            _this.presentToast('Erreur lors du chargement');
        });
    };
    ProfilePage.prototype.createFileName = function () {
        var d = new Date();
        var n = d.getTime();
        return n + '.jpg';
    };
    return ProfilePage;
}());
ProfilePage = __decorate([
    Component({
        selector: 'page-profile',
        templateUrl: 'profile.html',
    }),
    __metadata("design:paramtypes", [NavController,
        NavParams,
        Camera,
        Transfer,
        File,
        FilePath,
        ActionSheetController,
        ToastController,
        Platform,
        LoadingController,
        App,
        AlertController,
        ModalController,
        AuthService])
], ProfilePage);
export { ProfilePage };
//# sourceMappingURL=profile.js.map