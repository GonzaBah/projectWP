///<reference path="../../../../node_modules/@types/googlemaps/index.d.ts"/>

import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormControl,FormGroup } from '@angular/forms';

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.component.html',
  styleUrls: ['./mapa.component.scss'],
})
export class MapaComponent implements OnInit {

  @ViewChild('divMap') divMap!: ElementRef;
  @ViewChild('inputOrigen') inputPlaces1!: ElementRef;
  @ViewChild('inputDestino') inputPlaces2!: ElementRef;

  mapa!: google.maps.Map;

  distancia!: string;
  formMapas!: FormGroup;
  origen: {};
  destino: {};
 

  constructor(private renderer: Renderer2) {



    this.formMapas = new FormGroup({

      busqueda: new FormControl(''),
      direccion: new FormControl(''),
      referencia: new FormControl(''),
      ciudad: new FormControl(''),
      provincia: new FormControl(''),
      region: new FormControl('')
    })
  }


  ngOnInit(): void {
    
  }

  ngAfterViewInit(): void {

    const opciones = {
      enableHighAccuracy: true,
      timeout: 6000,
      maximumAge: 0
    }


    if (navigator.geolocation) {

      navigator.geolocation.getCurrentPosition(async (position) => {
        console.log("Ubicación actual (autodoxeo)",position)
        this.origen = {
          latitud: position.coords.latitude,
          longitud: position.coords.longitude,
        };
        console.log(this.origen)
        
        await this.cargarMapa(position);
        this.cargarAutocomplete();
        this.cargarAutocomplete2();

        console.log(["position"])

      }, null, opciones);


    } else {
      console.log("navegador no compatible")
    }



  };

  //Recuperar datos del formulario
  onSubmit() {
    console.log("Datos del formulario: ", this.formMapas.value)
  };

  //calcular ruta
  async mapRuta() {

    const directionService = new google.maps.DirectionsService();
    const directionRender = new google.maps.DirectionsRenderer();

    await directionRender.setMap(this.mapa);
    let origen = (document.getElementById('inputOrigen') as HTMLInputElement).value;
    let destino = (document.getElementById('inputDestino') as HTMLInputElement).value;
    directionService.route({

      origin: origen,
      destination: destino,
      travelMode: google.maps.TravelMode.DRIVING

    }, resultado => {
      console.log(resultado);
      directionRender.setDirections(resultado);


    });

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

  cargarMapa(position: any): any {

    const opciones = {
      center: new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
      zoom: 17,
      mapTypeId: google.maps.MapTypeId.ROADMAP

    };
    
    

    this.mapa = new google.maps.Map(this.renderer.selectRootElement(this.divMap.nativeElement), opciones)





  };




    



}
