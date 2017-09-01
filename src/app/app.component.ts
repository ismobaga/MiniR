import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Keyboard } from '@ionic-native/keyboard';
import { AngularFireAuth} from 'angularfire2/auth';
import { TabsPage } from '../pages/tabs/tabs';
//import { WelcomePage } from '../pages/welcome/welcome';
//import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';

import { MediatorProvider } from '../providers/mediatorProvider';



@Component({
  templateUrl: 'app.html',

})

export class MyApp {
  rootPage:any ;//= LoginPage;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, public afAuth: AngularFireAuth, public medProvid: MediatorProvider, public keyboard: Keyboard) {
    platform.ready().then(() => {
      // const authObserver = afAuth.authState.subscribe(user => {
      //     if (JSON.parse(localStorage.getItem('userData'))) { 
      //       this.rootPage = HomePage;
      //       authObserver.unsubscribe();
      //     } else {
      //       this.rootPage = WelcomePage;
      //       authObserver.unsubscribe();              
      //     }
      // });
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.

      statusBar.styleDefault();
      medProvid.initLocaleDB();
      splashScreen.hide();
      this.intialize();
       // this.keyboard.disableScroll(true);
       //medProvid.initLocaleDB();
    });
  }

     intialize() {
    this.afAuth.authState.subscribe(auth => {
      if (auth) {
        this.rootPage = TabsPage;
      } else {
        this.rootPage = LoginPage;
      }
    });
  }
}
