import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { ApiRestService } from '../services/api-rest.service';
import { wayDBService } from '../services/way-db.service'

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit{
  arrayUser: any[] = [];
  username: any;
  pass: any;
  constructor(private toastController: ToastController, private router: Router, private api: ApiRestService, private wayDB: wayDBService, private storage: Storage) {
  }

  async inicioToast(var1: string){
    const toast = await this.toastController.create({
      message: 'Bienvenido ' + var1,
      duration: 1500
    });
    toast.present();
  }

  async errorToast() {
    const toast = await this.toastController.create({
      message: 'Correo o Contraseña invalido',
      duration: 2000
    });
    toast.present();
  }

  async login() {
    let ini = 0;
    for(let i of this.arrayUser){
      if(this.username == i.username && this.pass == i.clave){
        //LOCAL STORAGE
        await this.storage.set('user', i.id);
        await this.inicioToast(i.nombre);
        await console.log(i.nombre)
        await this.router.navigate(['/main']);
        await ini++;
        break;
      }else{
        console.log("Siguiente Usuario");
      }
    }
    if (ini == 0){
      this.errorToast();
    }
  }

  ngOnInit(){
    this.wayDB.dbState().subscribe(res => {
      if (res) {
        this.wayDB.fetchUsers().subscribe(item => {
          this.arrayUser = item;
        })
        this.wayDB.returnUsers();
      }
    })
    
    this.storage.create();

    this.api.getUsers().subscribe(async (res) => {
      for (let i of res){
        await this.wayDB.ApiUser(i.id, i.nombre, '', '', '', '', i.clave, i.id_rol)
      }
      console.log(res);
      console.log(res[0].nombre);

    }, (error) => {
      console.log(error)
    });

    this.api.getAutos().subscribe(async (res) => {
      for (let i of res){
        await this.wayDB.ApiAuto(i.patente, '', '', i.marca, 0, i.id_usuario)
      }
      console.log(res)
      console.log(res[0].patente)
    }, (error) => {
      console.log(error)
    });
    //this.storage.get('user').then(data => {
    //  this.wayDB.returnUser(data);
    //}).catch(e => {
    //  console.log(e)
    //})
  }
}
