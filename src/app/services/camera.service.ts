import { Injectable } from '@angular/core';
import { Camera, CameraOptions } from '@awesome-cordova-plugins/camera/ngx';
import { Storage } from '@ionic/storage';
import { BehaviorSubject, Observable } from 'rxjs';
import { Usuario } from './clases/usuario';
import { wayDBService } from './way-db.service';

@Injectable({
  providedIn: 'root'
})
export class CameraService {
  foto = new BehaviorSubject([]);
  arrayUser: Usuario[] = [];
  base64Image: any;
  constructor(private storage: Storage, private camera: Camera, private wayDB: wayDBService) { 
    this.wayDB.dbState().subscribe(res => {
      if (res) {
        this.wayDB.fetchUsers().subscribe(item => {
          this.arrayUser = item;
        })
      }
    })
  }

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
