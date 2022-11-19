import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { Auto } from 'src/app/services/clases/auto';
import { Marca } from 'src/app/services/clases/marca';
import { wayDBService } from 'src/app/services/way-db.service';

@Component({
  selector: 'app-ajustes-veh',
  templateUrl: './ajustes-veh.page.html',
  styleUrls: ['./ajustes-veh.page.scss'],
})
export class AjustesVehPage implements OnInit {

  user: any = {
    id: 0,
  };
  arrayAuto: any[] = [{
    patente: '',
    color: '',
    modelo: '',
    annio: 0,
    idUsuario: 0,
    idMarca: 0,
  }];
  arrayMarcas: Marca[];

  marca: string = "";
  varEd: boolean = true;

  constructor(private storage: Storage, private router: Router, private wayDB: wayDBService) { }
  editarVeh(){
    this.varEd = false;
  }
  async confirmEdit(){
    let pat = document.getElementById("patenteEd") as HTMLInputElement;
    let mar = document.getElementById("marcaEd") as HTMLInputElement;
    let mod = document.getElementById("modeloEd") as HTMLInputElement;
    let col = document.getElementById("colorEd") as HTMLInputElement;
    let annio = document.getElementById("annioEd") as HTMLInputElement;

    await this.wayDB.editarAuto(pat.value, col.value, mod.value, parseInt(annio.value), this.user.id, parseInt(mar.value), this.arrayAuto[0].patente);

    this.varEd = true;
  }
  ngOnInit() {
    this.wayDB.dbState().subscribe(res => {
      if (res) {
        this.wayDB.fetchAutos().subscribe(item => {
          this.arrayAuto = item;
        });
        this.wayDB.fetchMarcas().subscribe(item => {
          this.arrayMarcas = item;
        })
      }
    })
    this.storage.get('user').then(data => {
      this.wayDB.returnAuto(data);
      this.user = data;
    })
    this.marca = this.arrayMarcas[this.arrayAuto[0].idMarca].nombreMarca;
  }

}
