import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NewViajePageRoutingModule } from './new-viaje-routing.module';

import { NewViajePage } from './new-viaje.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NewViajePageRoutingModule
  ],
  declarations: [NewViajePage]
})
export class NewViajePageModule {}
