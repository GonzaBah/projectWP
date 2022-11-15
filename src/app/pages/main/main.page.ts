import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
export class MainPage implements OnInit {
  user: any;
  constructor(private storage: Storage) { 
    this.storage.get('user').then((data) => {
      this.user = data;
      console.log(JSON.stringify(this.user));
    });
    
  }

  ngOnInit() {
    
  }

}
