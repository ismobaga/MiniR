import { Component } from '@angular/core';
import {  ViewController, LoadingController, NavController, NavParams } from 'ionic-angular';
import * as moment from 'moment';
import { DocumentProvider } from '../../../providers/document/document';
/**
 * Generated class for the EditNamePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-document',
  templateUrl: 'new-document.html',
})
export class NewDocumentPage {
  document:Document = new Document();
  minDate= new Date().toISOString();
  title: string= null;
  documentLoaded: boolean = false;

  constructor(
  	public navCtrl: NavController,
  	public navParams: NavParams,
  	public viewCtrl: ViewController,
    public loadingCtrl: LoadingController,
    public documentProvider:DocumentProvider
    ) {
    if (this.navParams.get('document')) {
              this.documentLoaded =true;
    }
    else{
  }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EditNamePage');
  }
  change() {
    // get elements
    var element   = document.getElementById('documentTextInput');
    var textarea  = element.getElementsByTagName('textarea')[0];

    // set default style for textarea
    textarea.style.minHeight  = '0';
    textarea.style.height     = '0';

    // limit size to 96 pixels (6 lines of text)
    var scroll_height = textarea.scrollHeight;
    if(scroll_height > 96)
      scroll_height = 96;

    // apply new style
    element.style.height      = scroll_height + "px";
    textarea.style.minHeight  = scroll_height + "px";
    textarea.style.height     = scroll_height + "px";
}
  getDocument(){
    this.documentProvider.ask().then((res)=>{
        this.documentLoaded =true;
    })
  }
    publier() {
    this.viewCtrl.dismiss();
  }

  

  dismiss() {
   this.viewCtrl.dismiss();
  }

}
