///<reference path="../../../../node_modules/@types/googlemaps/index.d.ts"/>

import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { wayDBService } from 'src/app/services/way-db.service';

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.component.html',
  styleUrls: ['./mapa.component.scss'],
})
export class MapaComponent implements OnInit {

  arrayComentario: any[];

  arrayDetViaje: any[] = [{
    idDet: 0,
    status: '',
    idusuario: '',
    idviaje: ''
  }]

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
  arrayAuto: any[] = [];

  asientos: any[] = [{
    username: 'vacio',
  }];

  varV: number = 0;

  @ViewChild('divMap') divMap!: ElementRef;
  @ViewChild('inputOrigen') inputPlaces1!: ElementRef;
  @ViewChild('inputDestino') inputPlaces2!: ElementRef;

  mapa!: google.maps.Map;

  distancia!: string;
  formMapas!: FormGroup;
  origen: {};
  destino: {};


  constructor(private toastController: ToastController, private loadController: LoadingController, private alertController: AlertController, private storage: Storage, private renderer: Renderer2, private wayDB: wayDBService, private router: Router) {
    this.formMapas = new FormGroup({

      busqueda: new FormControl(''),
      direccion: new FormControl(''),
      referencia: new FormControl(''),
      ciudad: new FormControl(''),
      provincia: new FormControl(''),
      region: new FormControl('')
    })
  }


  async ngOnInit() {
    await this.wayDB.dbState().subscribe(res => {
      if (res) {
        this.wayDB.fetchUsers().subscribe(item => {
          this.arrayUser = item;
        })
        this.wayDB.fetchViaje().subscribe(item => {
          this.arrayViaje = item;
        })
        this.wayDB.fetchDetViaje().subscribe(item => {
          this.arrayDetViaje = item;
        })
        this.wayDB.fetchComentarios().subscribe(item => {
          this.arrayComentario = item;
        })
        this.wayDB.fetchAutos().subscribe(item => {
          this.arrayAuto = item;
        })
        this.wayDB.fetchAsientos().subscribe(item => {
          this.asientos = item;
        })
      }
    })
    await this.storage.get('user').then(async (data) => {
      await this.wayDB.returnUser(data);
      if (await this.arrayUser[0].idRol == 1) {
        await this.wayDB.returnAuto(this.arrayUser[0].id);
      }
    })

  }

  async ngAfterViewInit() {

    const opciones = {
      enableHighAccuracy: true,
      timeout: 6000,
      maximumAge: 0
    }
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        console.log("Ubicación actual (autodoxeo)", position)
        this.origen = {
          latitud: position.coords.latitude,
          longitud: position.coords.longitude,
        };

        await this.cargarMapa(position);
        await this.cargarAutocomplete();
        await this.cargarAutocomplete2();

        console.log(["position"])

      }, null, opciones);


    } else {
      console.log("navegador no compatible")
    }

  };

  async presentCom() {
    const alert = await this.alertController.create({
      header: '¡Viaje Terminado!',
      inputs: [
        {
          name: 'comentario',
          placeholder: 'Escribe un comentario del viaje',
          type: 'text',
          value: ''
        },
        {
          name: 'puntaje',
          placeholder: '1 al 10',
          type: 'number',
          value: 1,
        }
      ],
      buttons: [
        {
          text: 'Enviar',
          handler: async (data) => {
            let dateH = await new Date().getHours();
            let dateM: any;
            if(new Date().getMinutes() < 10){
              dateM ='0'+ await new Date().getMinutes();
            }else{
              dateM = await new Date().getMinutes();
            }
            let date: string = await (dateH + ':' + dateM);
            await this.loadCargando("Subiendo Comentario...", 2000);
            await this.wayDB.agregarComentario(data.puntaje, data.comentario, this.arrayUser[0].id, this.arrayViaje[0].idviaje).then(async (data) => {
              await this.loadCargando("Subiendo Registro...", 1000);
              await this.wayDB.agregarRegistro(date, this.arrayUser[0].id, this.arrayViaje[0].idviaje, this.arrayComentario[0].idCom);
            });
            await this.msgToast('¡Viaje Finalizado Con Éxito!');
          }
        }
      ]
    });
    await alert.present();
  }
  async presentMonto(today, time, origen, destino) {
    const alert = await this.alertController.create({
      header: 'Ingrese el Monto del Viaje',
      inputs: [
        {
          name: 'monto',
          placeholder: 'Ingrese un monto',
          type: 'number',
          value: 0
        },{
          name: 'asientos',
          placeholder: 'Asientos disponibles',
          type: 'number',
          value: 4
        }
      ],
      buttons: [
        {
          text: 'Aceptar',
          handler: async (data) => {
            await this.loadCargando("Agregando Viaje...", 2000);
            await this.wayDB.agregarViaje('activo', today, time, data.asientos, data.monto, origen, destino, this.arrayAuto[0].patente);
            await this.storage.clear();
            await this.storage.set('user', this.arrayUser[0].id)
            await this.storage.set('viaje', { id: this.arrayViaje[0].idviaje })
            this.varV = await 1;
          }
        }
      ]
    });
    await alert.present();
  }

  async msgToast(msg: string) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 1500
    });
    await toast.present();
  }
  async loadCargando(msg, time){
    const load = await this.loadController.create({
      message: "<ion-label class='fuente'>"+msg+"</ion-label>",
      duration: time,
      spinner: 'circles',
    })
    await load.present();
  }
  async finalizar() {
    console.log('finalizado');
    await this.storage.clear();
    await this.storage.set('user', this.arrayUser[0].id);
    if (this.arrayUser[0].idRol == 1 && this.arrayAuto[0].patente == this.arrayViaje[0].patente) {
      await this.loadCargando("Finalizando Viaje...", 2000);
      await this.wayDB.editarStatusViaje(this.arrayViaje[0].idviaje, 'terminado');
      this.msgToast('¡Viaje de Conductor Finalizado!');
      //await this.wayDB.returnViaje3(this.arrayAuto[0].patente);
    } else {
      await this.presentCom();
      await this.loadCargando("Finalizando Viaje...", 2000);
      await this.wayDB.editarStatusDet(this.arrayDetViaje[0].idDet, 'terminado', this.arrayUser[0].id);
      
    }
    return await this.router.navigate(['/main']);
  }
  async asientosDisp(){
    let asiento = ['vacio', 'vacio', 'vacio', 'vacio'];
    await this.wayDB.returnDetViaje2(this.arrayViaje[0].idviaje).then(async (data) => {});
    await console.log(JSON.stringify(this.asientos));
    await this.loadCargando("Cargando...", 1000);
    for (let i = 0; i < this.asientos.length; i++){
      if(this.asientos[i].username){
        asiento[i] = this.asientos[i].username;
      }
    }
    const alert = await this.alertController.create({
      header: 'Vista de Asientos',
      message: '<label class="fuente">Asiento 1: '+asiento[0]+'</label><br>'+
      '<label class="fuente">Asiento 2: '+asiento[1]+'</label><br>'+
      '<label class="fuente">Asiento 3: '+asiento[2]+'</label><br>'+
      '<label class="fuente">Asiento 4: '+asiento[3]+'</label>',
      buttons: [
        {
          text: 'Cerrar',
        }
      ]
    });
    await alert.present();
  }
  //Recuperar datos del formulario
  onSubmit() {
    console.log("Datos del formulario: ", this.formMapas.value)
  };
  async mapRuta2(origen, destino) {

    const directionService = new google.maps.DirectionsService();
    const directionRender = new google.maps.DirectionsRenderer();

    await directionRender.setMap(this.mapa);

    console.log("resultados: " + origen + " ; " + destino)
    directionService.route({
      origin: origen,
      destination: destino,
      travelMode: google.maps.TravelMode.DRIVING

    }, resultado => {
      console.log(resultado);
      directionRender.setDirections(resultado);
    });

  }
  //calcular ruta
  async mapRuta() {

    let hours = new Date().getHours() + 1;
    let minutes = new Date().getMinutes();
    let time: string = hours + ':' + minutes;

    let todayD = new Date().getDate();
    let todayM = new Date().getMonth();
    let todayY = new Date().getFullYear();
    let today: string = todayD + '/' + todayM + '/' + todayY;

    const directionService = new google.maps.DirectionsService();
    const directionRender = new google.maps.DirectionsRenderer();

    await directionRender.setMap(this.mapa);
    let origen = (document.getElementById('inputOrigen') as HTMLInputElement).value;
    let destino = (document.getElementById('inputDestino') as HTMLInputElement).value;
    if (origen == '' || destino == ''){
      this.msgToast("Por favor, ingrese origen y destino");
    } else {
      await this.presentMonto(today, time, origen, destino);
      directionService.route({
        origin: origen,
        destination: destino,
        travelMode: google.maps.TravelMode.DRIVING

      }, resultado => {
        console.log(resultado);
        directionRender.setDirections(resultado);
      });
      console.log('HOY: ' + time + ' ; FECHA: ' + today)
    }
    
  }

  //Autocompleto

  private cargarAutocomplete() {

    const autocomplete = new google.maps.places.Autocomplete(this.renderer.selectRootElement(this.inputPlaces1.nativeElement), {
      componentRestrictions: {
        country: ["CL"]
      },
      fields: ["address_components", "geometry"],
      types: ["address"],
    })


    google.maps.event.addListener(autocomplete, 'place_changed', () => {

      const place: any = autocomplete.getPlace();
      console.log("el place completo es:", place);
      this.destino = place.geometry.location;
      this.destino = place.geometry.location.LatLng;

      this.mapa.setCenter(place.geometry.location);

      this.llenarFormulario(place);
    })
  }

  private cargarAutocomplete2() {

    const autocomplete = new google.maps.places.Autocomplete(this.renderer.selectRootElement(this.inputPlaces2.nativeElement), {
      componentRestrictions: {
        country: ["CL"]
      },
      fields: ["address_components", "geometry"],
      types: ["address"],
    })


    google.maps.event.addListener(autocomplete, 'place_changed', () => {

      const place: any = autocomplete.getPlace();
      console.log("el place completo es:", place);
      this.destino = place.geometry.location;
      this.destino = place.geometry.location.LatLng;

      this.mapa.setCenter(place.geometry.location);

      this.llenarFormulario(place);
    })
  }

  //Formulario

  llenarFormulario(place: any) {
    console.log("que", place)

    const addressNameFormat: any = {
      'street_number': 'short_name',
      'route': 'long_name',
      'administrative_area_level_1': 'short_name',
      'administrative_area_level_2': 'short_name',
      'administrative_area_level_3': 'short_name',
      'country': 'long_name',

    };

    const getAddressComp = (type: any) => {
      for (const component of place.address_components) {
        if (component.types[0] === type) {

          return component[addressNameFormat[type]];
        }
      }
      return ' '
    };

    const componentForm = {
      direccion: 'location',
      ciudad: "administrative_area_level_3",
      provincia: 'administrative_area_level_2',
      region: 'administrative_area_level_1'
    };

    Object.entries(componentForm).forEach(entry => {
      const [key, value] = entry;

      this.formMapas.controls[key].setValue(getAddressComp(value))
    });

    this.formMapas.controls['direccion'].setValue(getAddressComp('route') + ' ' + getAddressComp('street_number'))
  };

  //Cargar Mapa

  async cargarMapa(position: any) {

    const opciones = {
      center: new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
      zoom: 17,
      mapTypeId: google.maps.MapTypeId.ROADMAP

    };
    this.mapa = new google.maps.Map(this.renderer.selectRootElement(this.divMap.nativeElement), opciones)
    await this.loadCargando("Cargando Mapa...", 3000);
    await this.storage.get('viaje').then(async (data) => {
      if (data.id) {
        await this.loadCargando("Viaje detectado...", 1500);
        await this.wayDB.returnViaje(data.id);
        await this.mapRuta2(this.arrayViaje[0].salida, this.arrayViaje[0].llegada);
        if (await this.arrayUser[0].idRol == 2) {
          await this.wayDB.returnDetViaje(this.arrayUser[0].id);
        } else {
          await this.wayDB.returnAuto(this.arrayUser[0].id)
        }
        this.varV = 1;
      }
    }).catch(e => {
      console.log(e)
    })
  };

}
