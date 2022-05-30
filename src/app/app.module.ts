import { ReceiptFavouritesPage } from './../pages/receipt-favourites/receipt-favourites';
import { ReceiptViewPopoverPage } from './../pages/receipt-view-popover/receipt-view-popover';
import { PromotionsPage } from './../pages/promotions-view/promotions-view';
import { FcmService } from './../providers/fcm-firebase';
import { Firebase } from '@ionic-native/firebase';
import { HCE } from '@ionic-native/hce';

import { LoginPage } from './../pages/login/login';
import { AuthProvider } from './../providers/auth-firebase';
import { MerchantFirebaseProvider } from './../providers/merchant-firebase';
import { AddReceiptPage } from './../pages/add-receipt/add-receipt';
import { ReceiptFirebaseProvider } from './../providers/receipt-firebase';
import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { ReceiptsPage } from '../pages/receipt-view/receipt-view';
import { ReceiptDetailsPage } from '../pages/receipt-details/receipt-details';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth'
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { BackgroundMode } from '@ionic-native/background-mode';
import { Camera } from '@ionic-native/camera';
import { NgxQRCodeModule } from 'ngx-qrcode2';
import { TokenFirebaseProvider } from '../providers/token-firebase';
import { NFCProvider } from '../providers/nfc-provider';
import { AngularFireStorageModule } from 'angularfire2/storage';
import { AngularFireStorage } from 'angularfire2/storage'
import { LongPressModule } from 'ionic-long-press';
import { Vibration } from '@ionic-native/vibration';
import { ReceiptViewFilterPage } from '../pages/receipt-view-filter/receipt-view-filter';
import { HighChartsProvider } from '../providers/high-charts';
import { ImageProvider } from '../providers/image-provider';
import { DatePipe } from '@angular/common';




const config = {
  apiKey: "APIKEY",
  authDomain: "zabs-fb-dev.firebaseapp.com",
  databaseURL: "https://zabs-fb-dev.firebaseio.com",
  projectId: "zabs-fb-dev",
  storageBucket: "zabs-fb-dev",
  messagingSenderId: "113696640369"
};


@NgModule({
  declarations: [
    MyApp,
    ReceiptsPage,
    ReceiptDetailsPage,
    AddReceiptPage,
    PromotionsPage,
    LoginPage,
    ReceiptViewPopoverPage,
    ReceiptViewFilterPage,
    ReceiptFavouritesPage
  ],
  imports: [
    LongPressModule,
    BrowserModule,
    FormsModule,
    HttpClientModule,
    NgxQRCodeModule,
    AngularFireDatabaseModule,
    AngularFireStorageModule,

    AngularFireModule.initializeApp(config),
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    ReceiptsPage,
    ReceiptDetailsPage,
    AddReceiptPage,
    PromotionsPage,
    LoginPage,
    ReceiptViewPopoverPage,
    ReceiptViewFilterPage,
    ReceiptFavouritesPage
  ],
  providers: [
    Vibration,
    StatusBar,
    SplashScreen,
    Camera,
    LocalNotifications,
    BackgroundMode,
    ReceiptFirebaseProvider,
    MerchantFirebaseProvider,
    TokenFirebaseProvider,
    AngularFireAuth,
    AuthProvider,
    HCE,
    FcmService,
    Firebase,
    NFCProvider,
    ImageProvider,
    DatePipe,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    HighChartsProvider
  ]
})
export class AppModule {}