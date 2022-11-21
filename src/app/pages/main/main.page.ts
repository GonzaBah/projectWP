import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
  arrayAuto: any[] = []
  arrayViaje: any[] = [{
    idviaje: 0,
    status: '',
    fechaViaje: '',
    horaSalida: '',
    asientosDisp: 0,
    monto: 0,
    salida: '',
    llegada: '',
    patente: '',
  }]

  valid: number = 0;
  constructor(private storage: Storage, private wayDB: wayDBService, private router: Router) { }


  continuar() {
    this.storage.set('viaje', { id: this.arrayViaje[0].idviaje });
    return this.router.navigate(['/mapagoogle']);
  }
  async ngOnInit() {
    const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
    await this.wayDB.dbState().subscribe(res => {
      if (res) {
        this.wayDB.fetchUsers().subscribe(item => {
          this.arrayUser = item;
        })
        this.wayDB.fetchViajes().subscribe(item => {
          this.arrayViaje = item;
        })
        this.wayDB.fetchAutos().subscribe(item => {
          this.arrayAuto = item;
        })
      }
    })
    await this.storage.get('user').then((data) => {
      this.wayDB.returnUser(data);
      console.log("PRUEBA STORAGE: " + data);
    });
    if (this.arrayUser[0].idRol == 1) {
      await this.wayDB.returnAuto(this.arrayUser[0].id);
      await sleep(1000);
      await this.wayDB.returnViaje3(this.arrayAuto[0].patente);
      console.log("PRUEBA VIAJE: "+this.arrayViaje[0].status);
      if (this.arrayViaje[0].status == "activo") {
        this.valid = 1;
      } else {
        this.valid = 0;
      }
    }
  }
}
