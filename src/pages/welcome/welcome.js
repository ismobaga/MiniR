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
import { NavController, LoadingController, NavParams } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';
import { SignupPage } from '../signup/signup';
import { AuthService } from '../../providers/auth-service/auth-service';
import { AngularFireAuth } from 'angularfire2/auth';
import { MediatorProvider } from '../../providers/mediatorProvider';
/**
 * Generated class for the WelcomePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
var WelcomePage = (function () {
    function WelcomePage(medProvid, afAuth, loadingCtrl, navCtrl, navParams, authService) {
        this.medProvid = medProvid;
        this.afAuth = afAuth;
        this.loadingCtrl = loadingCtrl;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.authService = authService;
        this.userData = { "email": "", "password": "" };
        if (JSON.parse(localStorage.getItem('userData'))) {
            var loader = this.loadingCtrl.create({
                duration: 200
            });
            loader.present();
            this.navCtrl.push(TabsPage);
        }
    }
    WelcomePage.prototype.signUp = function () {
        this.navCtrl.push(SignupPage);
    };
    WelcomePage.prototype.login = function () {
        var _this = this;
        var user = {
            uid: '',
            password: '',
            email: '',
            photo: '',
            username: ''
        };
        var loader = this.loadingCtrl.create({
            duration: 200
        });
        loader.present();
        this.authService.postData(this.userData, 'login').then(function (result) {
            _this.responseData = result;
            localStorage.setItem('userData', JSON.stringify(_this.responseData));
            var token = _this.responseData.userData.fireToken;
            _this.afAuth.auth.signInWithCustomToken(token).then(function (data) {
                var userDet = _this.responseData.userData;
                user.uid = userDet.id;
                user.email = userDet.email;
                user.username = userDet.username;
                user.photo = userDet.profile_image;
                _this.medProvid.saveLoggedinUser(user);
            }).catch(function (error) {
                // Handle Errors here.
                var errorMessage = error.message;
                // ...
            });
            _this.navCtrl.push(TabsPage);
        }, function (err) {
            // Error log
        });
    };
    WelcomePage.prototype.forgotPwd = function () {
    };
    return WelcomePage;
}());
WelcomePage = __decorate([
    Component({
        selector: 'page-welcome',
        templateUrl: 'welcome.html',
    }),
    __metadata("design:paramtypes", [MediatorProvider, AngularFireAuth, LoadingController, NavController, NavParams, AuthService])
], WelcomePage);
export { WelcomePage };
//# sourceMappingURL=welcome.js.map