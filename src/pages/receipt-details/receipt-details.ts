import { Item } from './../../models/Receipt/RItem';
import { NgxQRCodeModule } from 'ngx-qrcode2';
import { Receipt } from './../../models/Receipt/Receipt';
import { Component } from '@angular/core';
import { NavController, NavParams, Platform } from 'ionic-angular';

@Component({
  selector: 'page-receipt-details',
  templateUrl: 'receipt-details.html'
})
export class ReceiptDetailsPage{

  receipt: Receipt;
  orderSize1: Item[];
  orderSize2: Item[];
  orderSize3: Item[];
  zabsQR: string;
  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private ngxQR:NgxQRCodeModule,
    private platform:Platform

    ) 
  {

    this.platform.registerBackButtonAction(()=>{
      this.navCtrl.pop();
    });

    this.receipt = this.navParams.data;
    if (!this.receipt.isManualEntry)
      this.zabsQR = this.receipt.key
    
    console.log(this.receipt);
    if(this.receipt.order != null  && this.receipt.order != undefined && !this.receipt.isManualEntry){
      this.orderSize1 = this.receipt.order.items.filter(x=>{
        return x.size == 1
      })
      this.orderSize2 = this.receipt.order.items.filter(x=>{
        return x.size ==2
      })
      this.orderSize3 = this.receipt.order.items.filter(x=>{
        return x.size ==3
      })

    }
  }



  viewMerchantPage(websiteUrl: string){
    window.open(websiteUrl,'_system', 'location=yes');
  }
  
  



  
}
