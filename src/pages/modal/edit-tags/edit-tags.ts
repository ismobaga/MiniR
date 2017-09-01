import { Component } from '@angular/core';
import { ViewController, LoadingController, NavController, NavParams } from 'ionic-angular';

import { AuthService } from '../../../providers/auth-service/auth-service';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/filter';
import { Tag } from '../../../shared/interfaces';
@Component({
  selector: 'page-edit-tags',
  templateUrl: 'edit-tags.html',
})
export class EditTagsPage {
	
		tags:Array<Tag>
    tagString:string;

tagsLoaded=['2017'];
keyCodes=[32, 188, 13];
//public validators = [this.notSpecialChar];
  constructor(
  	public navCtrl: NavController,
  	public navParams: NavParams,
  	public viewCtrl: ViewController,
    public loadingCtrl: LoadingController,
	private authService: AuthService
    ) {
    //if(!this.tags)
      //this.tags=[];

    // this.reverseTranform();
  }
notSpecialChar(){
  return {
                'notSpecialChar': false
            };
}
    public errorMessages = {
        'notSpecialChar': 'Votre tag ne doit pas contenir de caratere bizar',
    };
  ionViewDidLoad() {
		this.tags = this.navParams.get('tags');
    console.log('ionViewDidLoad EditTagsPage');
  }
  updateTags() {
 
   this.viewCtrl.dismiss({tags:this.tags, changed:true});
    // Get back to profile page. You should do that after you got data from API
  }
  
  dismiss() {
   this.viewCtrl.dismiss({changed:false});
  }

}
