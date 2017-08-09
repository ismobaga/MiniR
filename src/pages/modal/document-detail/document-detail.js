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
import { ViewController, LoadingController, NavController, NavParams } from 'ionic-angular';
/**
 * Generated class for the EditNamePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
var DocumentDetailPage = (function () {
    function DocumentDetailPage(navCtrl, navParams, viewCtrl, loadingCtrl) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.viewCtrl = viewCtrl;
        this.loadingCtrl = loadingCtrl;
        this.user = {
            annee: "2e Annee"
        };
    }
    DocumentDetailPage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad EditNamePage');
    };
    DocumentDetailPage.prototype.updateProfileAnnee = function () {
    };
    DocumentDetailPage.prototype.dismiss = function () {
        this.viewCtrl.dismiss();
    };
    return DocumentDetailPage;
}());
DocumentDetailPage = __decorate([
    Component({
        selector: 'page-document-detail',
        templateUrl: 'document-detail.html',
    }),
    __metadata("design:paramtypes", [NavController,
        NavParams,
        ViewController,
        LoadingController])
], DocumentDetailPage);
export { DocumentDetailPage };
//# sourceMappingURL=document-detail.js.map