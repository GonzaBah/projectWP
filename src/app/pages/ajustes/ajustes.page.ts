import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-ajustes',
  templateUrl: './ajustes.page.html',
  styleUrls: ['./ajustes.page.scss'],
})
export class AjustesPage implements OnInit {
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

  constructor(private router: Router, private storage: Storage) {
    this.storage.get('user').then((data) => {
      this.user = data;
      console.log("PRUEBA STORAGE: "+this.user.idRol);
    });
  }

  logout(){
    this.storage.set('user', '');
    this.storage.clear();
    
    return this.router.navigate([''])
  }
  ngOnInit() {
  }

}
