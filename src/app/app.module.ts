import { NgModule, ErrorHandler, LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
// import { Storage } from '@ionic/storage';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { AboutPage } from '../pages/about/about';
import { WelcomePage } from '../pages/welcome/welcome';
import { SignupPage } from '../pages/signup/signup';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { MessagePage } from  '../pages/message/message';
import { MessageDetailPage } from '../pages/message-detail/message-detail';
import { Conversation } from '../pages/conversation/conversation';
import { NewMessagePage } from '../pages/new-message/new-message';
import { PostPopover } from '../pages/home/post-popover';
import { DocumentPage } from '../pages/document/document';
import { EvenementPage } from '../pages/evenement/evenement';

import { ProfilePage } from '../pages/profile/profile';
import { TabsPage } from '../pages/tabs/tabs';
import { EditNamePage } from '../pages/modal/edit-name/edit-name';
import { EditAnneePage } from '../pages/modal/edit-annee/edit-annee';
import { DocumentDetailPage } from '../pages/modal/document-detail/document-detail';
import { NewEventPage } from '../pages/modal/new-event/new-event';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ParallaxDirective } from '../directives/parallax/parallax';

import { File } from '@ionic-native/file';
import { Transfer } from '@ionic-native/transfer';
import { FileTransfer} from '@ionic-native/file-transfer';
import { FilePath } from '@ionic-native/file-path';
import { Camera } from '@ionic-native/camera';
import { DocumentViewer } from '@ionic-native/document-viewer';
import { AuthService } from '../providers/auth-service/auth-service';
import { MomentModule } from 'angular2-moment';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';


import { InAppBrowser } from '@ionic-native/in-app-browser';
import { ThemeableBrowser } from '@ionic-native/themeable-browser';

import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';

import { SqlStorage } from '../shared/SqlStorage';
import { UtilsProvider } from '../providers/utilsProvider';
import { OnlineProvider } from '../providers/onlineProvider';
import { BackendProvider } from '../providers/backendProvider';
import { MediatorProvider } from '../providers/mediatorProvider';
import { LogProvider } from '../providers/logProvider';
import { SQLite } from '@ionic-native/sqlite';
import { AngularFireDatabase } from 'angularfire2/database';
import { NgCalendarModule } from 'ionic2-calendar';




export const firebaseConfig = {
    apiKey: "AIzaSyCLDqQmpoxOmJ52oVZI6vU-CkySEKtYYb0",
    authDomain: "cdi-mini.firebaseapp.com",
    databaseURL: "https://cdi-mini.firebaseio.com",
    projectId: "cdi-mini",
    storageBucket: "cdi-mini.appspot.com",
    messagingSenderId: "671622401447"
};

@NgModule({
  declarations: [
    MyApp,
    WelcomePage,
    SignupPage,
    MessagePage,
    Conversation,
    MessageDetailPage,
    NewMessagePage,
    NewEventPage,
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
    EditAnneePage,
	DocumentDetailPage
  ],
  imports: [
    BrowserModule,
    HttpModule, 
    MomentModule,
    NgCalendarModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireAuthModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    WelcomePage,
    SignupPage,
    MessagePage,
    Conversation,
    MessageDetailPage,
    NewMessagePage,
    DocumentPage,
    NewEventPage,
    EvenementPage,
    ContactPage,
    PostPopover,
    ProfilePage,
    HomePage,
    TabsPage,
    EditNamePage,
    EditAnneePage,
	DocumentDetailPage
    ],
  providers: [
    StatusBar,
    SplashScreen,
    File,
    Transfer,
    FileTransfer,
    FilePath,
    Camera,
    SQLite,
    DocumentViewer,
    AuthService,
    InAppBrowser,
    ThemeableBrowser,
	BarcodeScanner,
    SqlStorage, UtilsProvider, SqlStorage, //Storage,
    AngularFireDatabase,
    MediatorProvider, OnlineProvider, BackendProvider, LogProvider,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    {provide: LOCALE_ID, useValue:'fr-CA'}
  ]
})
export class AppModule {}
