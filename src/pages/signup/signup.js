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
import { WelcomePage } from '../welcome/welcome';
import { AuthService } from '../../providers/auth-service/auth-service';
import { AngularFireAuth } from 'angularfire2/auth';
/**
 * Generated class for the SignupPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
var SignupPage = (function () {
    function SignupPage(afAuth, loadingCtrl, navCtrl, navParams, authService) {
        this.afAuth = afAuth;
        this.loadingCtrl = loadingCtrl;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.authService = authService;
        this.userData = { "password": "", "first_name": "", "last_name": "", "email": "" };
    }
    SignupPage.prototype.signup = function () {
        var _this = this;
        var loader = this.loadingCtrl.create({
            duration: 200
        });
        loader.present();
        this.authService.postData(this.userData, 'user').then(function (result) {
            _this.responseData = result;
            //console.log(this.responseData);
            localStorage.setItem('userData', JSON.stringify(_this.responseData));
            var token = _this.responseData.userData.fireToken;
            _this.afAuth.auth.signInWithCustomToken(token).catch(function (error) {
                // Handle Errors here.
                // var errorCode = error.code;
                var errorMessage = error.message;
                // ...
            });
            _this.navCtrl.push(TabsPage);
        }, function (err) {
            // Error log
            console.log(err);
        });
    };
    SignupPage.prototype.login = function () {
        //Login page link
        this.navCtrl.push(WelcomePage);
    };
    return SignupPage;
}());
SignupPage = __decorate([
    Component({
        selector: 'page-signup',
        templateUrl: 'signup.html',
    }),
    __metadata("design:paramtypes", [AngularFireAuth, LoadingController, NavController, NavParams, AuthService])
], SignupPage);
export { SignupPage };
//# sourceMappingURL=signup.js.map