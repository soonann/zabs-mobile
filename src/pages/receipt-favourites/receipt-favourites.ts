import { AuthProvider } from './../../providers/auth-firebase';
import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Receipt } from '../../models/Receipt/Receipt';
import { ReceiptFirebaseProvider } from '../../providers/receipt-firebase';

/**
 * Generated class for the ReceiptFavouritesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-receipt-favourites',
  templateUrl: 'receipt-favourites.html',
})
export class ReceiptFavouritesPage implements OnInit {

  receiptList : Receipt[];
  records:number;

  constructor(public navCtrl: NavController, public navParams: NavParams, private fbReceiptService: ReceiptFirebaseProvider, private auth: AuthProvider) {
  

  }

  ngOnInit(){
    this.fbReceiptService.getReceiptsByUserFavourited().subscribe(x=>{
      this.receiptList = x;
      // this.records = x.length;
    })
  }



  toggleFav(data:Receipt){
    let path = '/receipts/'+ this.auth.user.uid +'/' ;
    let item = {};
    data.isSaved ? item = {"isSaved":false } : item = {"isSaved":true};
    
    this.fbReceiptService.toggleFavourite(path,data.key,item);
    
  }


}
