import { AngularFireAuth } from 'angularfire2/auth';
import { Merchant } from './../models/Merchant';
import { MerchantFirebaseProvider } from './merchant-firebase';
import * as firebase from 'firebase';
import { AuthProvider } from './auth-firebase';
import { Receipt } from '../models/Receipt/Receipt';
import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireStorage } from 'angularfire2/storage'
import { Observable } from 'rxjs';
import { map, filter } from 'rxjs/operators';


 

@Injectable()

export class ReceiptFirebaseProvider {

  receiptList: Receipt[];
  merchantList : Merchant[];
  user: firebase.User;

  constructor(
    private db: AngularFireDatabase, 
    private store:AngularFireStorage, 
    private auth: AngularFireAuth,
    private merchant:MerchantFirebaseProvider
    ){

    this.auth.user.subscribe( data=>{
      this.user = data;
      
    })
    
    this.merchant.getAllMerchants().subscribe((data)=>{
      this.merchantList = data;
    });
    

  }

  
  getReceiptsByLoggedInUser(): Observable<any[]> {
    
    let receipts$: Observable<any[]>;

    receipts$ = this.db.list<Receipt>('/receipts/'+ this.user.uid, qr => qr.orderByChild("isVisible").equalTo(true)).snapshotChanges().pipe(

      // map initial format to object format
      map(x => x.map(y => ({ key: y.payload.key, ...y.payload.val()}))),
      
   
      // // calculate total values
      // map(x => { 

      //   return this.calculateTotal(x)
      // }),

      // bind merchant
      map(x => {  return x.map(y => {
        y.date_dt = new Date(y.date);
        y.merchant = this.merchantList.find( merch => merch.key == y.merchantId );
        return y;
        })} 
      ),


      // sort values by date
      map(x => x.sort((a,b) => {
 
        return new Date(b.date).valueOf() - new Date(a.date).valueOf();
      }))

    );
    
    
    // return the observable
    return receipts$;

  }


  getReceiptsByUserFavourited(): Observable<any[]> {
    
    let receipts$: Observable<any[]>;

    receipts$ = this.db.list<Receipt>('/receipts/'+ this.user.uid, qr => qr.orderByChild("isVisible").equalTo(true)).snapshotChanges().pipe(

      // map initial format to object format
      map(x => x.map(y => ({ key: y.payload.key, ...y.payload.val()}))),
      
   
      // // calculate total values
      // map(x => { 

      //   return this.calculateTotal(x)
      // }),

      // bind merchant
      map(x => {  return x.map(y => {
        y.date_dt = new Date(y.date);
        y.merchant = this.merchantList.find( merch => merch.key == y.merchantId );
        return y;
        })} 
      ),

      map(x=> x.filter(y=>{
        return y.isSaved;
      })),


      // sort values by date
      map(x => x.sort((a,b) => {
 
        return new Date(b.date).valueOf() - new Date(a.date).valueOf();
      }))

    );
    
    
    // return the observable
    return receipts$;

  }



  
  
  getReceiptsByDate(month, year): Observable<any[]> {
    
    let receipts$: Observable<any[]>;

    receipts$ = this.db.list<Receipt>('/receipts/'+ this.user.uid, qr => qr.orderByChild("isVisible").equalTo(true)).snapshotChanges().pipe(

      // map initial format to object format
      map(x => x.map(y => ({ key: y.payload.key, ...y.payload.val()}))),
      
   
      // // calculate total values
      // map(x => { 

      //   return this.calculateTotal(x)
      // }),

      // bind merchant
      map(x => {  return x.map(y => {
        
        y.merchant = this.merchantList.find( merch => merch.key == y.merchantId );
        return y;
        })} 
      ),
      map(x=> x.filter(y=>{
        console.log(new Date(y.date).getMonth()+1, new Date(y.date).getFullYear())
        return new Date(y.date).getMonth()+1 == month && new Date(y.date).getFullYear() == year
      })),

      // sort values by date
      map(x => x.sort((a,b) => {

        return new Date(b.date).valueOf() - new Date(a.date).valueOf();
      }))
    
      
    );
    
    
    // return the observable
    return receipts$;

  }






  searchReceipt(receipts: Receipt[], searchText:string){
    return receipts.filter(x=>{
      x.merchant.name.toLowerCase().includes(searchText.toLowerCase())
    });
  }

  getSelectedReceipts(data: any[]): any[]{
    return data.filter(x=>x.isSelected);
  }


  toggleFavourite(path,receiptKey,isSaved){
    this.db.list(path).update(receiptKey, isSaved);
  }


  

  // do i still keep this? lol 
  calculateTotal(data: any[]): any[] {

    data.forEach(x => {

      // for each item in the list 
   
      x.transaction.items.forEach(y => {

    
        x.transaction.subtotal? 
        x.transaction.subtotal += (y.price * y.qty):
        x.transaction.subtotal = (y.price * y.qty);  

      });
      
      // undefined
 
      if(typeof(x.transaction.subItems) != 'undefined'){
        x.transaction.subItems.forEach(y =>{

          x.transaction.total? 
          x.transaction.total += (y.price * y.qty):
          x.transaction.total =  x.transaction.subtotal +  (y.price * y.qty);

        });

      }
      // not undefined
      else{
        // no additional items, so total = subtotal
        x.transaction.total =  x.transaction.subtotal
       
      }
    

    })

    return data;
  }


  // getItemsByStatus(status: string): Observable<any[]> {

  //   return this.db.list(this.node, ref => ref.orderByChild('status').equalTo(status)).snapshotChanges().pipe(

  //     map(changes =>

  //       changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))));

  // }

 
  addReceiptByImage(base64Image:string, imagePath ){
      
      var ref = this.store.storage.ref();
      var photoRef = ref.child(imagePath+'/receiptScanned');
      let img  = base64Image.split(',')[1];
      return photoRef.putString(img, 'base64', { contentType: 'image/jpeg' });
    
  }


  getReceiptImageByPath(imageUrl:string){
    var ref = firebase.storage().ref();
    var photoRef = ref.child(imageUrl);
    return photoRef.getDownloadURL();
  }


  addManualEntry(item){
    this.db.list('/receipts/' + this.user.uid + '/').push(item);
  }

  // getDownloadUrl(imageUrl: string) {
  
  //   var ref = firebase.storage().ref();

  //   var photoRef = ref.child(imageUrl);

  //   return photoRef.getDownloadURL();

  // }
  addItem(item) {
    this.db.list('/item').push(item);
  }


  removeItem(item) {
    this.db.list('/receipts').remove(item.key);
  }

 
  updateItem(path,item) {
    this.db.list(path).update(item.key, item);
  }

 

}