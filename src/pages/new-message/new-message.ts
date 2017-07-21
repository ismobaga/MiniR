import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the NewMessagePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-new-message',
  templateUrl: 'new-message.html',
})
export class NewMessagePage {
  public user_checked:boolean = false;
  public input_visible:boolean = false;

  public friends = [
    {
      id: 1,
      profile_img: 'http://malimoncton.ga/storage/tommy.jpg',
      username: 'Tommy Bia'
    },
    {
      id: 2,
      profile_img: 'http://malimoncton.ga/storage/membre/youba.jpg',
      username: 'Youba Smk'
    },
    {
      id: 3,
      profile_img: 'http://malimoncton.ga/storage/membre/raoul.jpg',
      username: 'Raoul Boudou'
    },
    {
      id: 4,
      profile_img: 'http://malimoncton.ga/storage/membre/ismail.jpg',
      username: 'Ismail Bagayoko'
    }
  ];
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NewMessagePage');
  }
    checkBox(username:string) {
    console.log('Username: ' + username);
    this.input_visible = true;
  }
}
