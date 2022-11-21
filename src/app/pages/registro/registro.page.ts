import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { wayDBService } from 'src/app/services/way-db.service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {
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
  arrayRegistros: any[] = [{
    idReg: 0,
    horaTermino: '',
    idusuario: 0,
    idviaje: 0,
    idcom: 0
  }]
  arrayComentarios: any[] = [{
    idCom: 0,
    puntaje: 0,
    texto: '',
    idusuario: 0,
    idviaje: 0
  }]
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
  constructor(private alertController: AlertController, private storage: Storage, private wayDB: wayDBService) { }

  async presentDetalles(horaTermino) {
    const alert = await this.alertController.create({
      header: 'Detalles del Viaje',
      message: 
      'Desde: '+this.arrayViaje[0].salida+'</br>'+
      'Hasta: '+this.arrayViaje[0].llegada+'</br>'+
      'Hora de Salida: '+this.arrayViaje[0].horaSalida+'</br>'+
      'Hora de Termino: '+horaTermino+'</br>'+
      'Patente del Auto: '+this.arrayViaje[0].patente+'</br>'+
      'Costo: '+this.arrayViaje[0].monto+'</br>'+
      'Puntaje: '+this.arrayComentarios[0].puntaje+'</br>'+
      'Comentario: '+this.arrayComentarios[0].texto+'</br>',
      buttons: [{
        text: 'Confirmar',
        handler: () => {
          // Continuar
        }
      }],
    });

    await alert.present();
  }
  async detalles(idviaje, idcom, horaTermino){
    const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
    this.wayDB.returnViaje(idviaje);
    this.wayDB.returnComentario(idcom)
    await sleep(500);
    this.presentDetalles(horaTermino);
  }
  async ngOnInit() {
    this.wayDB.dbState().subscribe(res => {
      if (res) {
        this.wayDB.fetchRegistros().subscribe(item => {
          this.arrayRegistros = item;
        })
        this.wayDB.fetchViajes().subscribe(item => {
          this.arrayViaje = item;
        })
        this.wayDB.fetchComentarios().subscribe(item => {
          this.arrayComentarios = item;
        })
      }
    })
    const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
    this.storage.get('user').then(async (data) => {
      this.wayDB.returnUser(data);
      console.log("PRUEBA STORAGE: "+ data);
      this.wayDB.returnViajes();
      await sleep(500);
      this.wayDB.returnRegistro(data);
      await sleep(100);
    });
    
  }

}
