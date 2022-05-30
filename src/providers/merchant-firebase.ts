import { Merchant } from './../models/Merchant';
import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

 

@Injectable()

export class MerchantFirebaseProvider {

  list: Merchant[]; // Stores the expense list for search functionality
  node = '/merchants/';
 

  constructor(private db: AngularFireDatabase) {

  }

 

  getAllMerchants(): Observable<any[]> {

    let observable: Observable<any[]>;
    // retrieve json from firebase 
    observable = this.db.list(this.node).snapshotChanges()
    
    // pipe to combine a few functions together to achieve your outcome
    .pipe(
      map(changes => changes.map(c => ({ key: c.payload.key, ...c.payload.val() })))
    );

    // pipe itself doesn't do anything unless it is subscribed to 
    observable.subscribe(result => {this.list = result;});
    
    // return the observable
    return observable;

  }

 

  getItemsByStatus(status: string): Observable<any[]> {

    return this.db.list(this.node, ref => ref.orderByChild('id').equalTo(status)).snapshotChanges().pipe(

      map(changes =>

        changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))));

  }

 

  searchItems(val: string): Merchant[] {

    if (!val || !val.trim()) {
      // if no search term, return all expenses.
      return this.list;
    }
    val = val.toLowerCase();
    return this.list.filter(item => true);
  }

 

  addItem(item) {
    this.db.list('/item').push(item);
  }


  removeItem(item) {
    this.db.list(this.node).remove(item.key);
  }

 
  updateItem(item) {
    this.db.list(this.node).update(item.key, item);
  }

 

}