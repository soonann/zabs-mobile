import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs';

@Injectable()
export class AuthProvider {

	public user: firebase.User;
    public fbAuthState$: Observable<firebase.User>;


	constructor(private afAuth: AngularFireAuth) {
        this.fbAuthState$ = this.afAuth.authState;
        this.fbAuthState$.subscribe(user => {
            if (user == null){
                this.signOut();
            }
            else{
                this.user = user;
            }
		});
    }
    


	signInWithEmail(email, password) {
        return this.afAuth.auth.signInWithEmailAndPassword(email, password);
    }
    
    signOut(){
        this.afAuth.auth.signOut();
    }

    isLoggedIn(): boolean{
        return this.user? true: false;
    }

}