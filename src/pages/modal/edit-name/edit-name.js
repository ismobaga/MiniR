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
import { AuthService } from '../../../providers/auth-service/auth-service';
var EditNamePage = (function () {
    function EditNamePage(navCtrl, navParams, viewCtrl, loadingCtrl, authService) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.viewCtrl = viewCtrl;
        this.loadingCtrl = loadingCtrl;
        this.authService = authService;
        this.user = {
            first_name: "Ismail",
            last_name: "Bagayoko",
            user_id: "",
            token: ""
        };
        this.user.first_name = navParams.get('first_name');
        this.user.last_name = navParams.get('last_name');
        this.user.user_id = navParams.get('user_id');
        this.user.token = navParams.get('token');
    }
    EditNamePage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad EditNamePage');
    };
    EditNamePage.prototype.updateProfileName = function () {
        var _this = this;
        var loader = this.loadingCtrl.create({
            duration: 200
        });
        loader.present()
            .then(function () {
            _this.authService.postData(_this.user, 'user/update/name')
                .then(function (result) {
                // localStorage.removeItem('userData');
                var data = JSON.parse(localStorage.getItem('userData'));
                data.userData['first_name'] = _this.user.first_name;
                data.userData['last_name'] = _this.user.last_name;
                localStorage.setItem('userData', JSON.stringify(data));
                console.log(result);
            }, function (err) {
                console.log(err);
            });
            _this.navCtrl.pop();
        }); // Get back to profile page. You should do that after you got data from API
    };
    EditNamePage.prototype.dismiss = function () {
        this.viewCtrl.dismiss();
    };
    return EditNamePage;
}());
EditNamePage = __decorate([
    Component({
        selector: 'page-edit-name',
        templateUrl: 'edit-name.html',
    }),
    __metadata("design:paramtypes", [NavController,
        NavParams,
        ViewController,
        LoadingController,
        AuthService])
], EditNamePage);
export { EditNamePage };
//# sourceMappingURL=edit-name.js.map