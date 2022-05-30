import { Token } from './../models/Token';
import { AuthProvider } from './auth-firebase';
import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';


 

@Injectable()

export class TokenFirebaseProvider {

  list: Token[]; 
 
  constructor(
    private db: AngularFireDatabase,
    private auth:AuthProvider
    ) {
    
  }

  getItemsById(status: string): Observable<any[]> {

    return this.db.list('', ref => ref.orderByChild('status').equalTo(status)).snapshotChanges().pipe(

      map(changes =>

        changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))));

  }
  

  addToken(valueHandler) {
    // generate token here
    let tokenId = this.db.createPushId();
    valueHandler(tokenId);

    // return update promise
    return this.db.list('/tokens/'+ tokenId+'/').set( 'user', this.auth.user.uid )
    

  }


  removeItem(item) {
    this.db.list('/receipts').remove(item.key);
  }

 
  updateItem(path,item) {
    this.db.list(path).update(item.key, item);
  }

 

}