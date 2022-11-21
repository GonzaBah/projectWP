import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { CameraService } from 'src/app/services/camera.service';
import { wayDBService } from 'src/app/services/way-db.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {
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

  varEd: boolean = false;

  constructor(private toastController: ToastController, private alertController: AlertController, private router: Router, private storage: Storage, private wayDB: wayDBService, private camera: CameraService) { 
    
    console.log("PRUEBA ONINIT: "+JSON.stringify(this.arrayUser[0]));
  }

  async msgToast(msg: string){
    const toast = await this.toastController.create({
      message: msg,
      duration: 1500
    });
    toast.present();
  }
  cambiarPhoto() {
    this.camera.takePicture(this.arrayUser[0].id)
    
    this.router.navigate(['/main']).then(e => {
      return this.router.navigate(['/perfil']);
    })
  }
  editarPerfil(){
    let username = document.getElementById('username') as HTMLInputElement;
    let rut = document.getElementById('rut') as HTMLInputElement;
    let nombre = document.getElementById('nombre') as HTMLInputElement;
    let apellido = document.getElementById('apellido') as HTMLInputElement;
    let correo = document.getElementById('correo') as HTMLInputElement;

    this.wayDB.editarUser(this.arrayUser[0].id, username.value, rut.value, nombre.value, apellido.value, correo.value, this.arrayUser[0].clave);
    this.msgToast('Confirmado!!');

    this.switchVarEd(false);
  }
  switchVarEd(cond){
    this.varEd = cond;
  }
  ngOnInit() {
    this.wayDB.dbState().subscribe(res => {
      if (res) {
        this.wayDB.fetchUsers().subscribe(item => {
          this.arrayUser = item;
        })
      }
    })
    this.storage.get('user').then(data => {
      this.wayDB.returnUser(data);
    })
  }
}
