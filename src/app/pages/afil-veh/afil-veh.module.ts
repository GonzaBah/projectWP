import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AfilVehPageRoutingModule } from './afil-veh-routing.module';

import { AfilVehPage } from './afil-veh.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AfilVehPageRoutingModule
  ],
  declarations: [AfilVehPage]
})
export class AfilVehPageModule {}
