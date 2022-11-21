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
  photo: any;
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

  constructor(private toastController: ToastController, private router: Router, private storage: Storage, private wayDB: wayDBService, private camera: CameraService) { 
    
  }

  async msgToast(msg: string){
    const toast = await this.toastController.create({
      message: msg,
      duration: 1500
    });
    toast.present();
  }
  async cambiarPhoto() {
    const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
    await this.camera.takePicture()
    sleep(1000);
    await this.wayDB.editarPhoto(this.arrayUser[0].id, this.photo).then(data => {
      this.msgToast("FOTO GUARDADA!!!")
    });
  }
  editarPerfil(){
    let username = (document.getElementById('username') as HTMLInputElement).value;
    let rut = (document.getElementById('rut') as HTMLInputElement).value;
    let nombre = (document.getElementById('nombre') as HTMLInputElement).value;
    let apellido = (document.getElementById('apellido') as HTMLInputElement).value;
    let correo = (document.getElementById('correo') as HTMLInputElement).value;

    this.wayDB.editarUser(this.arrayUser[0].id, username, rut, nombre, apellido, correo, this.arrayUser[0].clave);
    this.msgToast('Confirmado!!');

    this.switchVarEd(false);
  }
  switchVarEd(cond){
    this.varEd = cond;
  }
  ngOnInit() {
    this.storage.create();
    this.wayDB.dbState().subscribe(res => {
      if (res) {
        this.wayDB.fetchUsers().subscribe(item => {
          this.arrayUser = item;
        })
      }
    })
    this.camera.fetchFoto().subscribe(item => {
      this.photo = item;
    })
    this.storage.get('user').then(data => {
      this.wayDB.returnUser(data);
    })
  }
}
