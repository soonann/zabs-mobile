import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';

/**
 * Generated class for the ReceiptViewFilterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-receipt-view-filter',
  templateUrl: 'receipt-view-filter.html',
})
export class ReceiptViewFilterPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, private viewCtrl:ViewController) {
  }

  dismiss(){
    this.viewCtrl.dismiss()
  }

  clear(){

  }


}
