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
  Photo: any;
  photo2: any;

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

  constructor(private router: Router, private storage: Storage, private wayDB: wayDBService, private camera: CameraService) { }
  actualizar() {
    this.wayDB.editarPhoto(this.user.id, this.Photo);
    this.storage.clear();
    for (let i of this.arrayUser) {
      //LOCAL STORAGE
      this.storage.set('user', i);
      this.storage.get('user').then(data => {
        this.user = data;
      })
    }
    this.photo2 = this.Photo;
  }

  cambiarPhoto() {
    this.camera.takePicture();
    this.actualizar();

    this.router.navigate(['/main']).then(e => {
      return this.router.navigate(['/perfil']);
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
    this.camera.fetchFoto().subscribe(item => {
      this.Photo = item;
    })
    this.storage.get('user').then((data) => {
      this.user = data;
      console.log("PRUEBA STORAGE: " + this.user.foto);
    });
    if(this.user.foto == ''){
      this.photo2 = '/assets/images/noperfil.jpg'
    }else{
      this.photo2 = this.user.foto;
    }
  }
}
