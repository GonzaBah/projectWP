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
  user: any = {
    id: 0,
    username: '',
    rut: '',
    nombre: '',
    apellido: '',
    correo: '',
    clave: '',
    idRol: 0
  };

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
          this.wayDB.deleteUser(this.user.id);
          this.storage.clear();
          return this.router.navigate(['/'])
        }
      }],
    });

    await alert.present();
  }

  eliminar(){
    this.presentConfirm();
    
  }
  async logout(){
    await this.storage.clear();
    
    return this.router.navigate(['/'])
  }

  ngOnInit() {
    this.storage.get('user').then((data) => {
      this.user = data;
      console.log("PRUEBA STORAGE: "+this.user.idRol);
    });
  }

}
