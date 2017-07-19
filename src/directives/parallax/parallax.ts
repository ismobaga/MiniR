import { Directive, ElementRef, Renderer} from '@angular/core';

/**
 * Generated class for the ParallaxDirective directive.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/DirectiveMetadata-class.html
 * for more info on Angular Directives.
 */
@Directive({
  selector: '[parallax]', // Attribute selector
  host: {
  	'(ionScroll)': 'onCntScroll($event)',
  }
})
export class ParallaxDirective {

  header:any;
  mainContent:any;

  constructor(public el: ElementRef, public re: Renderer) {
    console.log('Hello ParallaxDirective Directive');
  }

  ngOnInit(){
  	let content = this.el.nativeElement.getElementsByClassName('scroll-content')[0];
  	this.header = content.getElementsByClassName('bg')[0];
  	this.mainContent = content.getElementsByClassName('main-content')[0];
  	console.log(this.header);
  	console.log(this.mainContent);
  	this.re.setElementStyle(this.header, 'webTransformOrigin', 'center bottom');
  	this.re.setElementStyle(this.header, 'background-size', 'cover');
  	this.re.setElementStyle(this.mainContent, 'position', 'absolute');
  }
  onCntScroll(ev){
  	ev.domWrite(()=> {
  		this.update(ev);
  	});
  }
  ta:any;
  sa:any;
  update(ev){
  	if (ev.scollTop>0) {
  		this.ta = ev.scrollTop/3;
  		this.sa = 1;
  	}
  	this.re.setElementStyle(this.header, 'webkitTransform', 'translate3d(0,'+ this.ta +'px,0) scale(1,1)');
  }

}
