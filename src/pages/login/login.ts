import { AuthProvider } from './../../providers/auth-firebase';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ReceiptsPage } from '../receipt-view/receipt-view';
import { auth } from 'firebase';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})

export class LoginPage{

  id: string;
  password:string;
  constructor(private navCtrl: NavController, private auth: AuthProvider) {

  }

  login(){
    this.auth.signInWithEmail('soonann.tan@outlook.com', '123456').then( x =>{
      this.navCtrl.setRoot(ReceiptsPage)
    });
    
  }

  



  
}
