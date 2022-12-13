import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { wayDBService } from 'src/app/services/way-db.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
export class MainPage implements OnInit {

  nombre: string = '';
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
  arrayAuto: any[] = []
  arrayViaje: any[] = [{
    idviaje: 0,
    status: '',
    fechaViaje: '',
    horaSalida: '',
    asientosDisp: 0,
    monto: 0,
    salida: '',
    llegada: '',
    patente: '',
  }]
  arrayDetViaje: any[] = [];
  cond: number = 2;
  valid: number = 0;
  constructor(private loadController: LoadingController, private storage: Storage, private wayDB: wayDBService, private router: Router) { }

  async loadCargando(msg, time){
    const load = await this.loadController.create({
      message: "<ion-label class='fuente'>"+msg+"</ion-label>",
      duration: time,
      spinner: 'circles',
    })
    await load.present();
  }

  async abrirViaje(){
    await this.loadCargando("Buscando Viaje en curso...", 1000)
    await this.storage.get('viaje').then(async (data) => {
      if(data.id){
        return this.router.navigate(['/mapagoogle']);
      }
    }).catch(e => {
      this.wayDB.returnDetViaje(this.arrayUser[0].id).then((data) => {
        this.storage.set('viaje', { id: this.arrayDetViaje[0].idviaje});
        return this.router.navigate(['/mapagoogle']);
      }).catch(e => {
        return this.router.navigate(['viajes']);
      })
    })
    
  }

  async ngOnInit() {
    const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
    await this.wayDB.dbState().subscribe(res => {
      if (res) {
        this.wayDB.fetchUsers().subscribe(item => {
          this.arrayUser = item;
        })
        this.wayDB.fetchViajes().subscribe(item => {
          this.arrayViaje = item;
        })
        this.wayDB.fetchAutos().subscribe(item => {
          this.arrayAuto = item;
        })
        this.wayDB.fetchDetViaje().subscribe(item => {
          this.arrayDetViaje = item;
        })
      }
    })
    await sleep(500);
    await this.storage.get('user').then(async (data) => {
      await this.loadCargando("Espere un momento...", 1500);
      if(data){
        await this.wayDB.returnUser(data).then(async (res) => {
          await sleep(800);
          if (await this.arrayUser[0].idRol == 1) {
            this.cond = 1;
            await this.wayDB.returnAuto(data);
            await this.wayDB.returnViaje3(this.arrayAuto[0].patente).then(res2 => {
              this.storage.set('viaje', { id: this.arrayViaje[0].idviaje })
            }).catch(e => {
              console.log("No hay ningún viaje en proceso");
            });
          }
        });

        await console.log("PRUEBA STORAGE: " + JSON.stringify(this.arrayUser));
      }
    });
    
  }
}
