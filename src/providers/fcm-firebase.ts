import { AuthProvider } from './auth-firebase';
import { AngularFireDatabase } from 'angularfire2/database';
import { Platform } from 'ionic-angular';
import { Injectable } from '@angular/core';
import { Firebase } from '@ionic-native/firebase';

@Injectable()
export class FcmService {

    constructor(
        private firebase: Firebase,
        private db: AngularFireDatabase,
        private platform: Platform,
        private auth:AuthProvider
    ) 
    {

    }

    async getToken() {
    let token;

    if (this.platform.is('android')) {
        token = await this.firebase.getToken();
    }

    if (this.platform.is('ios')) {
      token = await this.firebase.getToken();
      await this.firebase.grantPermission();
    }

    this.saveToken(token);
  }

  saveToken(token) {
    if (!token) return;
    let currentUserId = this.auth.user.uid;
    const devicesRef = this.db.list('/users/'+ currentUserId +'/');
    return devicesRef.set('deviceId',token);
  }

  onNotifications() {
    return this.firebase.onNotificationOpen();
  }

  offNotifications(){
    return this.firebase.unregister();
  }


}