
import { ReceiptFirebaseProvider } from '../../providers/receipt-firebase';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth-firebase';
import { TokenFirebaseProvider } from '../../providers/token-firebase';





@Component({
  selector: 'page-promotions-view',
  templateUrl: 'promotions-view.html'
})

export class PromotionsPage{


  constructor(
    private navCtrl: NavController,
    private localNotifications:LocalNotifications,

  ) 
  {
  

  }

  pushLocalNotification(text:string){
    this.localNotifications.schedule({
      text: text,
      data: text,
      sound: null
   });
  }

}


  

  

