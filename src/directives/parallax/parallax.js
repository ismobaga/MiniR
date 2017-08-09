var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Directive, ElementRef, Renderer } from '@angular/core';
/**
 * Generated class for the ParallaxDirective directive.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/DirectiveMetadata-class.html
 * for more info on Angular Directives.
 */
var ParallaxDirective = (function () {
    function ParallaxDirective(el, re) {
        this.el = el;
        this.re = re;
        console.log('Hello ParallaxDirective Directive');
    }
    ParallaxDirective.prototype.ngOnInit = function () {
        var content = this.el.nativeElement.getElementsByClassName('scroll-content')[0];
        this.header = content.getElementsByClassName('bg')[0];
        this.mainContent = content.getElementsByClassName('main-content')[0];
        console.log(this.header);
        console.log(this.mainContent);
        this.re.setElementStyle(this.header, 'webTransformOrigin', 'center bottom');
        this.re.setElementStyle(this.header, 'background-size', 'cover');
        this.re.setElementStyle(this.mainContent, 'position', 'absolute');
    };
    ParallaxDirective.prototype.onCntScroll = function (ev) {
        var _this = this;
        ev.domWrite(function () {
            _this.update(ev);
        });
    };
    ParallaxDirective.prototype.update = function (ev) {
        if (ev.scollTop > 0) {
            this.ta = ev.scrollTop / 3;
            this.sa = 1;
        }
        this.re.setElementStyle(this.header, 'webkitTransform', 'translate3d(0,' + this.ta + 'px,0) scale(1,1)');
    };
    return ParallaxDirective;
}());
ParallaxDirective = __decorate([
    Directive({
        selector: '[parallax]',
        host: {
            '(ionScroll)': 'onCntScroll($event)',
        }
    }),
    __metadata("design:paramtypes", [ElementRef, Renderer])
], ParallaxDirective);
export { ParallaxDirective };
//# sourceMappingURL=parallax.js.map