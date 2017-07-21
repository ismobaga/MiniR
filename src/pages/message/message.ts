import { Component } from '@angular/core';
import { App, NavController, NavParams } from 'ionic-angular';

import { MessageDetailPage } from '../message-detail/message-detail';
import { NewMessagePage } from '../new-message/new-message';

/**
 * Generated class for the MessagePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-message',
  templateUrl: 'message.html',
})
export class MessagePage {
	public messages = [
    {
      id: 1,
      profile_img: 'http://malimoncton.ga/storage/tommy.jpg',
      sender: 'Tommy Bia',
      last_message: 'How you doin?',
      time: '6h'
    },
    {
      id: 2,
      profile_img: 'http://malimoncton.ga/storage/membre/youba.jpg',
      sender: 'Youba Smk',
      last_message: 'Ouais?',
      time: '6h'
    },
    {
      id: 3,
      profile_img: 'http://malimoncton.ga/storage/membre/raoul.jpg',
      sender: 'Raoul Boudou',
      last_message: 'LOL. Ionic in 2017',
      time: '11h'
    },
    {
      id: 4,
      profile_img: 'http://malimoncton.ga/storage/membre/ismail.jpg',
      sender: 'Ismail Bagayoko',
      last_message: 'si je te dit',
      time: '1d'
    }
    
  ];
  constructor(public navCtrl: NavController, public navParams: NavParams, private app: App) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MessagePage');
  }
    goNewMessage() {
    this.app.getRootNav().push(NewMessagePage);
  }

  goMessageDetail(sender:string, profile_img:string, last_message:string){
  	this.app.getRootNav().push(MessageDetailPage, { sender: sender, profile_img: profile_img, last_message: last_message});
  }
  delete(item){

  }

  mute(item){

  }
  more(item){

  }

}
