import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-ajustes',
  templateUrl: './ajustes.page.html',
  styleUrls: ['./ajustes.page.scss'],
})
export class AjustesPage implements OnInit {

  constructor(private router: Router, private storage: Storage) { }

  logout(){
    this.storage.clear();
    return this.router.navigate([''])
  }
  ngOnInit() {
  }

}
