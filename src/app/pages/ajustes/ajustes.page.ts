import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { wayDBService } from 'src/app/services/way-db.service';

@Component({
  selector: 'app-ajustes',
  templateUrl: './ajustes.page.html',
  styleUrls: ['./ajustes.page.scss'],
})
export class AjustesPage implements OnInit {
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

  constructor(private alertController: AlertController, private router: Router, private storage: Storage, private wayDB: wayDBService) { }

  async presentConfirm() {
    const alert = await this.alertController.create({
      header: 'Eliminar Cuenta',
      subHeader: '¿Estás seguro de querer borrar tu cuenta? Esta acción es IRREVERSIBLE',
      buttons: [{
        text: 'Cancelar',
        role: 'cancel',
        handler: () => {
          console.log('Cancelado');
        }
      },{
        text: 'Confirmar',
        handler: () => {
          this.wayDB.deleteUser(this.arrayUser[0].id);
          this.storage.clear();
          return this.router.navigate(['/'])
        }
      }],
    });

    await alert.present();
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

  async presentAfil() {
    const alert = await this.alertController.create({
      header: 'Dejar de ser WayDriver',
      subHeader: '¿Estás seguro de querer dejar de ser WayDriver? ¡Ayudarías a muchos estudiantes!',
      buttons: [{
        text: 'Cancelar',
        role: 'cancel',
        handler: () => {
          console.log('Cancelado');
        }
      },{
        text: 'Confirmar',
        handler: () => {
          this.wayDB.editarUserAfil(this.arrayUser[0].id, 0);
          this.wayDB.deleteAutoAfil(this.arrayUser[0].id)
        }
      }],
    });

    await alert.present();
  }

  eliminar(){
    this.presentConfirm();
    
  }
  dejarAfil(){
    this.presentAfil();
  }
  logout(){
    this.storage.clear();
    this.wayDB.returnUsers();
    return this.router.navigate(['/'])
  }

  ngOnInit() {
    this.wayDB.dbState().subscribe(res => {
      if (res) {
        this.wayDB.fetchUsers().subscribe(item => {
          this.arrayUser = item;
        })
      }
    })
    this.storage.get('user').then((data) => {
      this.wayDB.returnUser(data);
      console.log("PRUEBA STORAGE: "+ data);
    });
  }

}
