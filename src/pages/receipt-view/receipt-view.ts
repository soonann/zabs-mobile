import { ReceiptFavouritesPage } from './../receipt-favourites/receipt-favourites';
import { ImageProvider } from './../../providers/image-provider';
import { HighChartsProvider } from './../../providers/high-charts';
import { ReceiptViewPopoverPage } from './../receipt-view-popover/receipt-view-popover';
import { StatusBar } from '@ionic-native/status-bar';
import { Observable, Subscription, Subject } from 'rxjs';
import { AuthProvider } from './../../providers/auth-firebase';
import { AddReceiptPage } from './../add-receipt/add-receipt';
import { ReceiptFirebaseProvider } from './../../providers/receipt-firebase';

import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavController, LoadingController, Loading, FabContainer, Platform, ViewController, PopoverController, ModalController, AlertController, Item, ActionSheetController } from 'ionic-angular';
import { ReceiptDetailsPage } from '../receipt-details/receipt-details';
import { Receipt } from '../../models/Receipt/Receipt';
import { HttpClient } from '@angular/common/http';
import { LoginPage } from '../login/login';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Vibration } from '@ionic-native/vibration';
import { ReceiptViewFilterPage } from '../receipt-view-filter/receipt-view-filter';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'page-receipt-view',
  templateUrl: 'receipt-view.html'
})
export class ReceiptsPage implements OnInit{

  chart: any;
  fbSubListener: Subscription;
  authListener: Subscription;
  receiptList: Receipt[];
  loadingPage: Loading;
  hasLoaded: boolean = false;
  isSelectMode: boolean = false;
  title: string = 'Receipts';
  active_color:string = 'primary'

  active_date: string = this.datePipe.transform(new Date(), 'yyyy-MM'); 


  max_date: string = this.datePipe.transform(new Date(), 'yyyy-MM') ;
  min_date: string = this.datePipe.transform(new Date().setTime(new Date().getTime() -  ( (24*60*60*1000) * 365 ) ), 'yyyy-MM'); ; 

  constructor(
    private navCtrl: NavController, 
    private fbReceiptService: ReceiptFirebaseProvider,
    private http: HttpClient,
    private auth:AuthProvider,
    private camera: Camera,
    private loadingCtrl: LoadingController,
    private status:StatusBar,
    private viewCtrl: ViewController,
    private platform: Platform,
    private vibrate:Vibration,
    private popoverCtrl: PopoverController,
    private highcharts: HighChartsProvider,
    private modal: ModalController,
    private alert: AlertController,
    private actionSheetCtrl: ActionSheetController,
    private imageFb: ImageProvider,
    private datePipe:DatePipe
  ) {
    

  }
  



  ngOnInit(){

    let active_date_arr =  this.active_date.split('-');
    this.fbSubListener = this.fbReceiptService.getReceiptsByDate( parseInt(active_date_arr[1]) , parseInt(active_date_arr[0])).subscribe( data => {
      this.receiptList = data;


      this.highcharts.initChart(data, this.active_date );
      // this.highcharts.setData(data);
      // apply magical filters
      
      
    });
   
    
  }

 
  
  onDateChanged(){
    this.fbSubListener.unsubscribe();
    this.ngOnInit();
  }


  addReceipt(params:any){
    if (!params) params = {};
    this.navCtrl.push(AddReceiptPage, params);
  }

  viewFavourites(){
    this.navCtrl.push(ReceiptFavouritesPage)
  }


  viewDetails(params:any){
    if (!params) params = {};
    this.navCtrl.push(ReceiptDetailsPage, params);
  }


  onFabButton(){
    
    const actionSheet = this.actionSheetCtrl.create({
      title: 'Add Expenditure',
      buttons: [
        {
          text: 'Manual Entry',
          handler: () => {
            this.navCtrl.push(AddReceiptPage)
            console.log('manual clicked');
          }
        },
        // {
        //   text: 'Scan Receipt',
        //   handler: () => {
            
        //     console.log('scan clicked');
        //   }
        // },{
        //   text: 'Add from gallery',
        //   handler: () => {
          
        //     console.log('scan clicked');
        //   }
        // },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }



// <--------------------------------------- popout and select states below this ------------------------------ >
 
  toggleFav(data:Receipt){
    let path = '/receipts/'+ this.auth.user.uid +'/' ;
    let item = {};
    data.isSaved ? item = {"isSaved":false } : item = {"isSaved":true};
    
    this.fbReceiptService.toggleFavourite(path,data.key,item);
    
  }

  showFilterModal(){
    let modal = this.modal.create(ReceiptViewFilterPage, {data:''}, {cssClass: 'popout-modal',enableBackdropDismiss:true} );
    modal.present();
  }

  presentPopover(myEvent) {
    let popover = this.popoverCtrl.create(ReceiptViewPopoverPage, {data:''}, {cssClass: 'popout-popover', enableBackdropDismiss:true});
    popover.present({
      ev: myEvent
    });
  }



  activateSelectMode(params:any){

      this.isSelectMode = true;

      // when long pressing an item, make it selected
      this.selectItem(params);
      this.vibrate.vibrate(30);

      this.updateSelectMode();
      this.platform.registerBackButtonAction(()=>{
        this.deactivateSelectMode();
      });

      
    }
  


  deactivateSelectMode(){
    
    this.isSelectMode = false;
    // unselect everything 
    this.receiptList.map(x => {
      x.isSelected = false;
    });
    this.updateSelectMode();

  }


  updateSelectMode(){  

    
    let active_bg =  '#646464';
    let active_fg =  'active-grey';
    let non_bg = '#009141';
    let non_fg = 'primary'

    if(this.isSelectMode){

      // change to select mode theme 
      this.viewCtrl.showBackButton(true);


      this.status.backgroundColorByHexString(active_bg);
      this.active_color = active_fg;
      let selected_no = this.fbReceiptService.getSelectedReceipts(this.receiptList).length;

      if (selected_no >0){
        this.title =  selected_no + ' Selected'
      }
      else{
        this.deactivateSelectMode();
      }
      
    }
    else{

      // revert to original theme
      this.viewCtrl.showBackButton(false);
      this.title =  'Receipts'
      this.status.backgroundColorByHexString(non_bg);
      this.active_color = non_fg;

    }

    
    
  }

  selectItem(params:any){

    
    // in select mode and clicked
    if (this.isSelectMode){

      
        if (params.isSelected){
          params.isSelected = false;
        }
        else{
          params.isSelected = true;
        }

        let selected_no = this.fbReceiptService.getSelectedReceipts(this.receiptList).length;

        if (selected_no >0){
          this.title =  selected_no + ' Selected'
        }
        else{
          this.deactivateSelectMode();
        }
        
      // add or remove items from selected mode 

    }
    // not in select mode and clicked 
    else{
      this.viewDetails(params);
    }


  }




}
