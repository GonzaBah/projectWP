import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
  photolink = '/noperfil.jpg';

  user: any = {
    id: 0,
    username: '',
    rut: '',
    nombre: '',
    apellido: '',
    correo: '',
    clave: '',
    foto: '',
    idRol: 0
  };

  constructor(private router: Router, private storage: Storage, private wayDB: wayDBService, private camera: CameraService) {
    this.storage.get('user').then((data) => {
      this.user = data;
      console.log("PRUEBA STORAGE: "+this.user.foto);
    });
  }
  actualizar(id){
    for(let i of this.arrayUser){
      if(id == i.id){
        //LOCAL STORAGE
        this.storage.set('user', i);
        this.storage.get('user').then(data => {
          this.user = data;
        })
      }
    }
  }

  cambiarPhoto(){
    this.camera.takePicture(this.user.id);
    this.actualizar(this.user.id);

    return this.router.navigate(['/main']).then(e => {
      this.router.navigate(['/perfil']);
    })
  }

  ngOnInit() {
    this.wayDB.dbState().subscribe(res => {
      if (res) {
        this.wayDB.fetchUsers().subscribe(item => {
          this.arrayUser = item;
        })
      }
    })
    
  }

}
