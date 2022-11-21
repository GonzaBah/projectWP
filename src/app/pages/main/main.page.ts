import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { wayDBService } from 'src/app/services/way-db.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
export class MainPage implements OnInit {

  nombre: string = '';
  arrayUser: any[] = [{
    id: 0,
    username: '',
    rut: '',
    nombre: '',
    apellido: '',
    correo: '',
    clave: '',
    idRol: 0
  }];
  constructor(private storage: Storage, private wayDB: wayDBService) { }

  async ngOnInit() {
    await this.wayDB.dbState().subscribe(res => {
      if (res) {
        this.wayDB.fetchUsers().subscribe(item => {
          this.arrayUser = item;
        })
      }
    })
    await this.storage.get('user').then((data) => {
      this.wayDB.returnUser(data);
      console.log("PRUEBA STORAGE: "+ data);
    });
  }
}
