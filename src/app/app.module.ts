import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { AboutPage } from '../pages/about/about';
import { WelcomePage } from '../pages/welcome/welcome';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { MessagePage } from  '../pages/message/message';
import { MessageDetailPage } from '../pages/message-detail/message-detail';
import { NewMessagePage } from '../pages/new-message/new-message';
import { PostPopover } from '../pages/home/post-popover';
import { DocumentPage } from '../pages/document/document';
import { EvenementPage } from '../pages/evenement/evenement';

import { ProfilePage } from '../pages/profile/profile';
import { TabsPage } from '../pages/tabs/tabs';
import { EditNamePage } from '../pages/modal/edit-name/edit-name';
import { EditAnneePage } from '../pages/modal/edit-annee/edit-annee';


import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ParallaxDirective } from '../directives/parallax/parallax';

import { File } from '@ionic-native/file';
import { Transfer } from '@ionic-native/transfer';
import { FilePath } from '@ionic-native/file-path';
import { Camera } from '@ionic-native/camera';
import { DocumentViewer } from '@ionic-native/document-viewer';


@NgModule({
  declarations: [
    MyApp,
    WelcomePage,
    MessagePage,
    MessageDetailPage,
    NewMessagePage,
    AboutPage,
    PostPopover,
    DocumentPage,
    EvenementPage,
    ContactPage,
    HomePage,
    ProfilePage,
    TabsPage,
    ParallaxDirective,
    EditNamePage,
    EditAnneePage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    WelcomePage,
    MessagePage,
    MessageDetailPage,
    NewMessagePage,
    DocumentPage,
    EvenementPage,
    ContactPage,
    PostPopover,
    ProfilePage,
    HomePage,
    TabsPage,
    EditNamePage,
    EditAnneePage
    ],
    providers: [
    StatusBar,
    SplashScreen,
    File,
    Transfer,
    FilePath,
    Camera,
    DocumentViewer,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
