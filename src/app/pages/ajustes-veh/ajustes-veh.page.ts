import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular';
import { Auto } from 'src/app/services/clases/auto';
import { wayDBService } from 'src/app/services/way-db.service';

@Component({
  selector: 'app-ajustes-veh',
  templateUrl: './ajustes-veh.page.html',
  styleUrls: ['./ajustes-veh.page.scss'],
})
export class AjustesVehPage implements OnInit {

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
  arrayAuto: any[] = [{
    patente: '',
    color: '',
    marca: '',
    modelo: '',
    annio: 0,
    idUsuario: 0,
  }];

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

    await this.wayDB.editarAuto(pat.value, col.value, mar.value, mod.value, parseInt(annio.value), this.arrayUser[0].id, this.arrayAuto[0].patente);

    this.varEd = true;
  }

  //Storage

  async CreateStorage(){
    await this.storage.create();
  }
  async ClearStorage(){
    await this.storage.clear();
  }
  async GetStorage(){
    await this.storage.get('user');
  }

  // fin storage
  ngOnInit() {
    this.wayDB.dbState().subscribe(res => {
      if (res) {
        this.wayDB.fetchAutos().subscribe(item => {
          this.arrayAuto = item;
        })
        this.wayDB.fetchUsers().subscribe(item => {
          this.arrayUser = item;
        })
      }
    })
    this.storage.get('user').then(data => {
      this.wayDB.returnAuto(data);
      this.wayDB.returnUser(data);
    })
  }

}
