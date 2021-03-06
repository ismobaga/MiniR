import { NgModule, ErrorHandler, LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
// import { Storage } from '@ionic/storage';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { AboutPage } from '../pages/about/about';
import { WelcomePage } from '../pages/welcome/welcome';
import { SignupPage } from '../pages/signup/signup';
import { LoginPage } from '../pages/login/login';
import { ProfilePicturePage } from '../pages/profile-picture/profile-picture';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { MessagePage } from  '../pages/message/message';
import { MessageDetailPage } from '../pages/message-detail/message-detail';
import { Conversation } from '../pages/conversation/conversation';
import { NewMessagePage } from '../pages/new-message/new-message';
import { PostPopover } from '../pages/home/post-popover';
import { QRResult } from '../pages/popover/qr-result/qr-result';
import { DocumentPage } from '../pages/document/document';
import { EvenementPage } from '../pages/evenement/evenement';

import { ProfilePage } from '../pages/profile/profile';
import { TabsPage } from '../pages/tabs/tabs';
import { EditNamePage } from '../pages/modal/edit-name/edit-name';
import { EditDocumentNamePage } from '../pages/modal/edit-document-name/edit-document-name';
import { EditAnneePage } from '../pages/modal/edit-annee/edit-annee';
import { DocumentDetailPage } from '../pages/modal/document-detail/document-detail';
import { EventDetailPage } from '../pages/modal/event-detail/event-detail';
import { NewEventPage } from '../pages/modal/new-event/new-event';
import { ImageViewer } from '../pages/modal/image-viewer/image-viewer';
import { NewDocumentPage } from '../pages/modal/new-document/new-document';
import { QRCodePage } from '../pages/modal/qr-code/qr-code';
import { EditTagsPage } from '../pages/modal/edit-tags/edit-tags'

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ParallaxDirective } from '../directives/parallax/parallax';

import { File } from '@ionic-native/file';
import { Transfer } from '@ionic-native/transfer';
import { FileTransfer} from '@ionic-native/file-transfer';
import { FilePath } from '@ionic-native/file-path';
import { FileChooser } from '@ionic-native/file-chooser';
import { Camera } from '@ionic-native/camera';
import { DocumentViewer } from '@ionic-native/document-viewer';
import { AuthService } from '../providers/auth-service/auth-service';
import { MomentModule } from 'angular2-moment';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { Keyboard } from '@ionic-native/keyboard';


import { InAppBrowser } from '@ionic-native/in-app-browser';
import { ThemeableBrowser } from '@ionic-native/themeable-browser';

import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { QRCodeModule } from 'angular2-qrcode';

import { SqlStorage } from '../shared/SqlStorage';
import { UtilsProvider } from '../providers/utilsProvider';
import { OnlineProvider } from '../providers/onlineProvider';
import { BackendProvider } from '../providers/backendProvider';
import { MediatorProvider } from '../providers/mediatorProvider';
import { LogProvider } from '../providers/logProvider';
import { EventProvider } from '../providers/eventProvider';
import { SQLite } from '@ionic-native/sqlite';
import { AngularFireDatabase } from 'angularfire2/database';
import { NgCalendarModule } from 'ionic2-calendar';
import { ImgHandlerProvider } from '../providers/img-handler/img-handler';
import { ChatProvider } from '../providers/chat/chat';
import { DocumentProvider } from '../providers/document/document';

import { TagInputModule } from 'ng2-tag-input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // this is needed! 
 
import { IonicImageViewerModule } from 'ionic-img-viewer';
import { IonicImageLoader } from 'ionic-image-loader';


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
    ProfilePicturePage,
    MessagePage,
    Conversation,
    LoginPage,
    MessageDetailPage,
    NewMessagePage,
    ImageViewer,
    NewEventPage,
    AboutPage,
    PostPopover,
    QRResult,
    DocumentPage,
    EvenementPage,
    ContactPage,
    HomePage,
    ProfilePage,
    TabsPage,
    QRCodePage,
    NewDocumentPage,
    ParallaxDirective,
    EditNamePage,
    EditAnneePage,
    EditDocumentNamePage,
    EditTagsPage,
	DocumentDetailPage,
    EventDetailPage

  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpModule, 
    MomentModule,
    IonicImageViewerModule,
    TagInputModule, BrowserAnimationsModule,
    QRCodeModule,
    NgCalendarModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireAuthModule,
    IonicImageLoader.forRoot(),
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
    LoginPage,
    NewDocumentPage,
    ProfilePicturePage,
    MessageDetailPage,
    NewMessagePage,
    DocumentPage,
    ImageViewer,
    EditTagsPage,
    NewEventPage,
    EvenementPage,
    ContactPage,
    PostPopover,
    QRResult,
    ProfilePage,
    HomePage,
    TabsPage,
    QRCodePage,
    EditNamePage,
    EditAnneePage,
    EditDocumentNamePage,
	DocumentDetailPage,
    EventDetailPage
    ],
  providers: [
    StatusBar,
    SplashScreen,
    File,
    FileChooser,
    Transfer,
    FileTransfer,
    FilePath,
    Camera,
    Keyboard,
    SQLite,
    DocumentViewer,
    AuthService,
    InAppBrowser,
    IonicImageLoader,
    ThemeableBrowser,
	BarcodeScanner,
    SqlStorage, UtilsProvider, SqlStorage, //Storage,
    AngularFireDatabase,
    EventProvider,
    MediatorProvider, OnlineProvider, BackendProvider, LogProvider,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    {provide: LOCALE_ID, useValue:'fr-CA'},
    ImgHandlerProvider,
    ChatProvider,
    DocumentProvider
  ]
})
export class AppModule {}
