import { Component, OnInit } from '@angular/core';
import { wayDBService } from 'src/app/services/way-db.service';
import { AlertController, LoadingController } from '@ionic/angular';
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
    status: '',
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
    status: '',
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
  constructor(private loadController: LoadingController, private alertController: AlertController, private storage: Storage, private wayDB: wayDBService, private router: Router) { }
  
  async loadCargando(msg){
    const load = await this.loadController.create({
      message: "<ion-label class='fuente'>"+msg+"</ion-label>",
      duration: 2000,
      spinner: 'circles',
    })
    await load.present();
  }

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
        handler: async () => {
          console.log('Cancelado');
        }
      },{
        text: 'Empezar',
        handler: async () => {
          // Aqui va el codigo del viaje
          const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
          await this.wayDB.agregarDetViaje('activo', this.arrayUser[0].id, this.arrayViaje[0].idviaje);
          await this.loadCargando("Espere un momento...")
          await this.storage.set('viaje', { id: this.arrayViaje[0].idviaje })
          await sleep(1000);
          return await this.router.navigate(['/mapagoogle']);
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
  async refresh(){
    await this.loadCargando("Buscando Viajes...")
    await this.wayDB.returnViajes();
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
  }

}
