import { HCE } from '@ionic-native/hce';
import { Injectable } from '@angular/core';
import { TokenFirebaseProvider } from './token-firebase';


@Injectable()
export class NFCProvider {

  constructor(
    private hce:HCE,
    private tokenfb:TokenFirebaseProvider
  ){

  }

  initializeHCE(){
    // Setup hce handlers

    // Activated Callback
    this.hce.registerCommandCallback((command) =>{
      let tokenId = '';
      if(command != undefined && command != null){
          this.tokenfb.addToken(value=>{
          tokenId = value;
        }).then(() => {
          this.hce.sendResponse(tokenId);
        },() => {
          alert('Transaction failed! Please try again!')
        });

        console.log('Android Console' );
      }
      else{
        console.log('Android Console' + ' Command was empty' )
      }

    },(failureCommand)=>{
        console.log('Android Console ' +failureCommand);
        });
      

    // Deactivated callback
    this.hce.registerDeactivatedCallback((x)=>{
      console.log('Deactivated '+x)
      },
    (y)=>{
      console.log('Failed to send '+y)
    });

  }
      
}