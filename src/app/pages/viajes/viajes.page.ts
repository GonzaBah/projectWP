import { Component, OnInit } from '@angular/core';
import { wayDBService } from 'src/app/services/way-db.service';
import { Viaje } from 'src/app/services/clases/viaje'
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-viajes',
  templateUrl: './viajes.page.html',
  styleUrls: ['./viajes.page.scss'],
})
export class ViajesPage implements OnInit {

  arrayViajes: any[] = [{
    idviaje: 0,
    fechaViaje: '',
    horaSalida: '',
    asientosDisp: 0,
    monto: 0,
    salida: '',
    patente: '',
  }];

  constructor(private alertController: AlertController, private wayDB: wayDBService) { }

  async presentConfirm() {
    const alert = await this.alertController.create({
      header: 'Detalles del Viaje',
      subHeader: 'Aquí irán los detalles del viaje',
      buttons: ['Continuar'],
    });

    await alert.present();
  }
  refresh(){
    
  }
  ngOnInit() {
    this.wayDB.dbState().subscribe(res => {
      if (res) {
        this.wayDB.fetchViajes().subscribe(item => {
          this.arrayViajes = item;
        })
      }
    })
  }

}
