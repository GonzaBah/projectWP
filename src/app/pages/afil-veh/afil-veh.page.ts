import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { Usuario } from 'src/app/services/clases/usuario';
import { wayDBService } from 'src/app/services/way-db.service';

@Component({
  selector: 'app-afil-veh',
  templateUrl: './afil-veh.page.html',
  styleUrls: ['./afil-veh.page.scss'],
})
export class AfilVehPage implements OnInit {

  arrayUser: any[] = [{
    id: 0,
    username: '',
    rut: '',
    nombre: '',
    apellido: '',
    correo: '',
    clave: '',
    foto: '',
    idRol: 0
  }];
  arrayMarca: any[] = [{
    idmarca: 0,
    nombreMarca: ''
  }];

  //Variables para el Auto
  patente: string;
  color: string;
  modelo: string;
  annio: number;
  marca: number;

  constructor(private alertController: AlertController, private storage: Storage, private wayDB: wayDBService, private router: Router) { }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: '¡Vehículo registrado!',
      subHeader: '¡Bienvenido WayDriver! Vuelve a iniciar sesión para empezar',
      buttons: ['Continuar'],
    });

    await alert.present();
  }

  async registrarVeh(){
    this.wayDB.editarUserAfil(this.arrayUser[0].id, 1);

    await this.wayDB.agregarAuto(this.patente, this.color, this.modelo, this.annio, this.arrayUser[0].id, this.marca).then(data=>{
      this.storage.clear()
      this.presentAlert();
      return this.router.navigate(['/']);
    }).catch(e=>{
      this.wayDB.editarUserAfil(this.arrayUser[0].id, 0);

      console.log("ERROR AGREGARAUTO: "+e);
    });
  }
  ngOnInit() {
    this.wayDB.dbState().subscribe(res => {
      if (res) {
        this.wayDB.fetchUsers().subscribe(item => {
          this.arrayUser = item;
        })
        this.wayDB.fetchMarcas().subscribe(item => {
          this.arrayMarca = item;
        })
      }
      this.wayDB.returnUsers();
    })
    this.storage.get('user').then((data) => {
      this.wayDB.returnUser(data);
      console.log("PRUEBA STORAGE: "+ data);
    });
  }

}
