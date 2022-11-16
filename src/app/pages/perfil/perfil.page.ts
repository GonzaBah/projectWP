import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { CameraService } from 'src/app/services/camera.service';
import { wayDBService } from 'src/app/services/way-db.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {
  arrayUser: any[] = [];
  arrayPhoto: any[] = [];
  user: any = {
    id: 0,
    username: '',
    rut: '',
    nombre: '',
    apellido: '',
    correo: '',
    clave: '',
    idRol: 0
  };

  constructor(private storage: Storage, private wayDB: wayDBService, private camera: CameraService) {
    this.storage.get('user').then((data) => {
      this.user = data;
      console.log("PRUEBA STORAGE: "+this.user.idRol);
    });
  }

  cambiarPhoto(){
    this.camera.takePicture();
  }
  ngOnInit() {
    this.wayDB.dbState().subscribe(res => {
      if (res) {
        this.wayDB.fetchUsers().subscribe(item => {
          this.arrayUser = item;
        })
      }
    })
    this.camera.fetchFoto().subscribe(item => {
      this.arrayPhoto = item;
    })
    
  }

}
