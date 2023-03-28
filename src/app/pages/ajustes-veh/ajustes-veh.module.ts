import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AjustesVehPageRoutingModule } from './ajustes-veh-routing.module';

import { AjustesVehPage } from './ajustes-veh.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AjustesVehPageRoutingModule
  ],
  declarations: [AjustesVehPage]
})
export class AjustesVehPageModule {}
