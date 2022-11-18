import { Component, OnInit } from '@angular/core';
import { wayDBService } from 'src/app/services/way-db.service';
import { Viaje } from 'src/app/services/clases/viaje'

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

  constructor(private wayDB: wayDBService) { }

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
    for (let i of this.arrayViajes){
      console.log("PATENTE: " + i.patente);
    }
  }

}
