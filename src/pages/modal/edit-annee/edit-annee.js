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
var EditAnneePage = (function () {
    function EditAnneePage(navCtrl, navParams, viewCtrl, loadingCtrl) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.viewCtrl = viewCtrl;
        this.loadingCtrl = loadingCtrl;
        this.user = {
            annee: "2e Annee"
        };
    }
    EditAnneePage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad EditNamePage');
    };
    EditAnneePage.prototype.updateProfileAnnee = function () {
        var _this = this;
        var loader = this.loadingCtrl.create({
            duration: 200
        });
        loader.present().then(function () { return _this.navCtrl.pop(); }); // Get back to profile page. You should do that after you got data from API
    };
    EditAnneePage.prototype.dismiss = function () {
        this.viewCtrl.dismiss();
    };
    return EditAnneePage;
}());
EditAnneePage = __decorate([
    Component({
        selector: 'page-edit-annee',
        templateUrl: 'edit-annee.html',
    }),
    __metadata("design:paramtypes", [NavController,
        NavParams,
        ViewController,
        LoadingController])
], EditAnneePage);
export { EditAnneePage };
//# sourceMappingURL=edit-annee.js.map