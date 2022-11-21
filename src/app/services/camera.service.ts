import { Injectable } from '@angular/core';
import { Camera, CameraOptions } from '@awesome-cordova-plugins/camera/ngx';
import { BehaviorSubject, Observable } from 'rxjs';
import { wayDBService } from './way-db.service';

@Injectable({
  providedIn: 'root'
})
export class CameraService {
  foto = new BehaviorSubject([]);
  base64Image: any;
  constructor(private camera: Camera, private wayDB: wayDBService) { }

  takePicture(){
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }

    this.camera.getPicture(options).then((imageData) => {
      this.base64Image = 'data:image/jpeg;base64,' + imageData;
      console.log("FOTO: " + imageData);
      this.foto.next(this.base64Image);
     }, (err) => { 
      console.log('ERROR: '+err);
     });
  }
  fetchFoto(): Observable<any>{
    return this.foto.asObservable();
  }
}
