import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Usuario } from 'src/app/services/clases/usuario';

@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
export class MainPage implements OnInit {
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
  constructor(private storage: Storage) { }

  ngOnInit() {
    this.storage.get('user').then((data) => {
      this.user = data;
      console.log("PRUEBA STORAGE: "+this.user.idRol);
    });
  }
}
