import { Component, OnInit } from '@angular/core';
import { wayDBService } from 'src/app/services/way-db.service';
import { AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';

@Component({
  selector: 'app-viajes',
  templateUrl: './viajes.page.html',
  styleUrls: ['./viajes.page.scss'],
})
export class ViajesPage implements OnInit {
  arrayUser: any[] = [{
    id: 0,
    username: '',
    rut: '',
    nombre: '',
    apellido: '',
    correo: '',
    clave: '',
    foto: '',
    idRol: 0,
  }];

  arrayViajes: any[] = [{
    idviaje: 0,
    fechaViaje: '',
    horaSalida: '',
    asientosDisp: 0,
    monto: 0,
    salida: '',
    llegada: '',
    patente: '',
  }];
  arrayViaje: any[] = [{
    idviaje: 0,
    fechaViaje: '',
    horaSalida: '',
    asientosDisp: 0,
    monto: 0,
    salida: '',
    llegada: '',
    patente: '',
  }]
  arrayDetViaje: any[] = [{
    idDet: 0,
    status: '',
    idusuario: '',
    idviaje: ''
  }]
  arrayAuto: any[] = [{
    patente: '',
    color: '',
    marca: '',
    modelo: '',
    annio: 0,
    idUsuario: 0,
  }]
  constructor(private alertController: AlertController, private storage: Storage, private wayDB: wayDBService, private router: Router) { }

  async presentConfirm() {
    const alert = await this.alertController.create({
      header: 'Detalles del Viaje',
      message: 
      'Desde: '+this.arrayViaje[0].salida+'</br>'+
      'Hasta: '+this.arrayViaje[0].llegada+'</br>'+
      'Hora de Salida: '+this.arrayViaje[0].horaSalida+'</br>'+
      'Patente del Auto: '+this.arrayAuto[0].patente+'</br>'+
      'Detalles del Auto: '+this.arrayAuto[0].marca+' '+this.arrayAuto[0].modelo+' '+this.arrayAuto[0].color+'</br>'+
      'Asientos Disponibles: '+this.arrayViaje[0].asientosDisp+'</br>'+
      'Costo: '+this.arrayViaje[0].monto+'</br>',
      buttons: [{
        text: 'Cancelar',
        role: 'cancel',
        handler: () => {
          console.log('Cancelado');
        }
      },{
        text: 'Empezar',
        handler: async () => {
          // Aqui va el codigo del viaje
          await this.wayDB.agregarDetViaje('activo', this.arrayUser[0].id, this.arrayViaje[0].idviaje);
          return this.router.navigate(['/mapagoogle']);
        }
      }],
    });

    await alert.present();
  }

  async verViaje(id, patente){
    await this.wayDB.returnViaje(id);
    await this.wayDB.returnAutoViaje(patente);
    await this.presentConfirm();
  }
  refresh(){
    
  }
  async ngOnInit(){
    await this.wayDB.dbState().subscribe(res => {
      if (res) {
        this.wayDB.fetchViajes().subscribe(item => {
          this.arrayViajes = item;
        })
        this.wayDB.fetchViaje().subscribe(item => {
          this.arrayViaje = item;
        })
        this.wayDB.fetchAutos().subscribe(item => {
          this.arrayAuto = item;
        })
        this.wayDB.fetchUsers().subscribe(item => {
          this.arrayUser = item;
        })
        this.wayDB.fetchDetViaje().subscribe(item => {
          this.arrayDetViaje = item;
        })
      }
    })
    await this.storage.get('user').then(data => {
      this.wayDB.returnUser(data);
    })
    await this.wayDB.returnDetViaje(this.arrayUser[0].id)
    if (this.arrayDetViaje[0]){
      this.storage.set('viaje', { id: this.arrayDetViaje[0].idviaje});
      return this.router.navigate(['/mapagoogle']);
    }
  }

}
