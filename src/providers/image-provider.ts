import { AuthProvider } from './auth-firebase';
import { HttpClient } from '@angular/common/http';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Injectable } from '@angular/core';
import { ReceiptFirebaseProvider } from './receipt-firebase';



@Injectable()
export class ImageProvider {

  constructor(
      private camera:Camera,
      private http: HttpClient,
      private auth: AuthProvider,
      private fbReceiptService: ReceiptFirebaseProvider
  ){

  }



    TakeReceiptPhoto(){

        const options: CameraOptions = {
        quality: 100,
        destinationType: this.camera.DestinationType.DATA_URL,
        sourceType: this.camera.PictureSourceType.CAMERA,
        encodingType: this.camera.EncodingType.JPEG
        };

        this.camera.getPicture(options).then( (imageData) => {
        // imageData is either a base64 encoded string or a file URI
        // If it's base64 (DATA_URL):
        
        let base64Image = 'data:image/jpeg;base64,' + imageData;
        let photoURL = this.auth.user.email.replace(/[^a-zA-Z0-9]/g, '_');
      
        
        this.fbReceiptService.addReceiptByImage(base64Image, photoURL  ).then((succ)=>{
          alert('Upload success');
            

            
    // this.ocrData(imageData).subscribe((data:any)=>{
    //     alert(data.responses[0].textAnnotations[0].description);

    // });



        },(err)=>{
          alert('Error!' + err)
        });

        }, (err) => {
        alert(err)
        // Handle error
        });

    }


    ocrData(base64){
        let apiKey = 'AIzaSyCR0e5uvtyz59MTBQYF1lqhl4sHMV_juEs';
        const body = {
        "requests": [
            {
            "image": {
                "content": base64
            },
            "features": [
                {
                "type": "TEXT_DETECTION"
                }
            ],
            "imageContext": {
                
                "languageHints":["en"]
            }
            }
        ]
        }
        return this.http.post('https://vision.googleapis.com/v1/images:annotate?key=' + apiKey, body);
        

    }




}

