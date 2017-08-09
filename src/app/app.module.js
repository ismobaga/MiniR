var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { NgModule, ErrorHandler } from '@angular/core';
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
import { MessagePage } from '../pages/message/message';
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
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ParallaxDirective } from '../directives/parallax/parallax';
import { File } from '@ionic-native/file';
import { Transfer } from '@ionic-native/transfer';
import { FileTransfer } from '@ionic-native/file-transfer';
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
export var firebaseConfig = {
    apiKey: "AIzaSyCLDqQmpoxOmJ52oVZI6vU-CkySEKtYYb0",
    authDomain: "cdi-mini.firebaseapp.com",
    databaseURL: "https://cdi-mini.firebaseio.com",
    projectId: "cdi-mini",
    storageBucket: "cdi-mini.appspot.com",
    messagingSenderId: "671622401447"
};
var AppModule = (function () {
    function AppModule() {
    }
    return AppModule;
}());
AppModule = __decorate([
    NgModule({
        declarations: [
            MyApp,
            WelcomePage,
            SignupPage,
            MessagePage,
            Conversation,
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
            EditAnneePage,
            DocumentDetailPage
        ],
        imports: [
            BrowserModule,
            HttpModule,
            MomentModule,
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
            SqlStorage, UtilsProvider, SqlStorage,
            AngularFireDatabase,
            MediatorProvider, OnlineProvider, BackendProvider, LogProvider,
            { provide: ErrorHandler, useClass: IonicErrorHandler }
        ]
    })
], AppModule);
export { AppModule };
//# sourceMappingURL=app.module.js.map