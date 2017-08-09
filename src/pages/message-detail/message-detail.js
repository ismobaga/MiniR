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
import { NavController, NavParams } from 'ionic-angular';
var MessageDetailPage = (function () {
    function MessageDetailPage(navCtrl, navParams) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.send_like_icon = false;
        this.likeBtnVisible = false;
        this.messages = []; // You can get all the chat details from your API
        this.sender = this.navParams.get('sender');
        this.profile_img = this.navParams.get('profile_img');
        this.last_message = this.navParams.get('last_message');
    }
    MessageDetailPage.prototype.sendLike = function () {
        if (this.send_like_icon === false) {
            this.send_like_icon = true;
        }
        // Allow heart effect
        this.likeBtnVisible = !this.likeBtnVisible;
    };
    return MessageDetailPage;
}());
MessageDetailPage = __decorate([
    Component({
        selector: 'page-message-detail',
        templateUrl: 'message-detail.html',
    }),
    __metadata("design:paramtypes", [NavController, NavParams])
], MessageDetailPage);
export { MessageDetailPage };
//# sourceMappingURL=message-detail.js.map