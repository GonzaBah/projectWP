import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MapagooglePageRoutingModule } from './mapagoogle-routing.module';

import { MapagooglePage } from './mapagoogle.page';
import { MatProgressSpinner, MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MapagooglePageRoutingModule,
    MatProgressSpinnerModule
  ],
  declarations: [MapagooglePage]
})
export class MapagooglePageModule {}
