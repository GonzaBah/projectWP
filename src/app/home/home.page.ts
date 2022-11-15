import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit{

  constructor(private storage: Storage) {
  }

  ngOnInit(){
    this.storage.create();
  }

  guardar(){
    this.storage.set('hola', 'uno');
  }
}
