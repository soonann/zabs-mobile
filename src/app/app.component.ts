import { FcmService } from './../providers/fcm-firebase';
import { NFCProvider } from './../providers/nfc-provider';
import { AuthProvider } from './../providers/auth-firebase';
import { LoginPage } from './../pages/login/login';
import { AngularFireAuth } from 'angularfire2/auth';
import { ReceiptFirebaseProvider } from './../providers/receipt-firebase';
import { BackgroundMode } from '@ionic-native/background-mode';

// Plugins
import { Component, ViewChild } from '@angular/core';
import { Platform, Nav, MenuController, ToastController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

// Pages 
import { ReceiptsPage } from '../pages/receipt-view/receipt-view';
import { ReceiptDetailsPage } from '../pages/receipt-details/receipt-details';
import { AddReceiptPage } from './../pages/add-receipt/add-receipt';
import { PromotionsPage } from './../pages/promotions-view/promotions-view';
import { User } from 'firebase';
import { NFC, Ndef } from '@ionic-native/nfc';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {

  @ViewChild(Nav) navCtrl: Nav;
    public rootPage:any = LoginPage;
    user: string = '';

  constructor(
    private platform: Platform, 
    private statusBar: StatusBar, 
    private splashScreen: SplashScreen, 
    private auth: AuthProvider,
    private menuCtrl: MenuController,
    private nfcProvider: NFCProvider,
    private fcm: FcmService,
    public toastController: ToastController) {
      
    this.platform.ready().then(() => {
      this.initializeApp();
    });
  }

  initializeApp(){
    // Okay, so the platform is ready and our plugins are available.
    // Here you can do any higher level native things you might need.

    // Default initializations
    
    this.statusBar.backgroundColorByHexString('#009141');
    this.nfcProvider.initializeHCE();
    this.splashScreen.hide();
    
    
    // Login required initializations 
    this.auth.fbAuthState$.subscribe(x => {
    
      // Not logged in
      if(x == null){
        this.menuCtrl.enable(false, 'zabs-consumer-menu');
        this.menuCtrl.swipeEnable(false, 'zabs-consumer-menu' )
        this.navCtrl.setRoot(LoginPage);
        this.fcm.offNotifications();
      }
  
      // Logged in
      else{
        this.user = x.email;
        this.menuCtrl.swipeEnable(true, 'zabs-consumer-menu')
        this.menuCtrl.enable(true, 'zabs-consumer-menu');
        this.navCtrl.setRoot(ReceiptsPage);
        this.notificationSetup();
        // prompt fingerprint here 

        
      }

    });

   


  }
  
  notificationSetup() {
    this.fcm.getToken();
    this.fcm.onNotifications().subscribe(
      (msg) => {
        if (this.platform.is('android')) {
          this.presentToast(msg.body);
        } else {
          this.presentToast(msg.body);
        }
      });
  }
  

  async presentToast(message) {
    const toast = await this.toastController.create({
      message,
      duration: 5000
    });
    toast.present();
  }

  goToReceiptView(params){
    if (!params) params = {};
    if (!(this.navCtrl.getActive().component ===  ReceiptsPage)) this.navCtrl.setRoot(ReceiptsPage);

  }

  goToPromotions(params){
    if (!params) params = {};
    if (!(this.navCtrl.getActive().component ===  PromotionsPage)) this.navCtrl.setRoot(PromotionsPage);

  }

  logOut(params){
    this.auth.signOut()
    
  }

  
}
