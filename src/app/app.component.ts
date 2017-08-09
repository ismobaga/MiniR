import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { AngularFireAuth} from 'angularfire2/auth';
//import { TabsPage } from '../pages/tabs/tabs';
import { WelcomePage } from '../pages/welcome/welcome';
import { HomePage } from '../pages/home/home';
//import { DocumentDetailPage } from '../pages/modal/document-detail/document-detail';

import { MediatorProvider } from '../providers/mediatorProvider';




@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = WelcomePage;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, afAuth: AngularFireAuth, public medProvid: MediatorProvider) {
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
      splashScreen.hide();
       //medProvid.initLocaleDB();
    });
  }
}
