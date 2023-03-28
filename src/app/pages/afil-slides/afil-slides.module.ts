import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AfilSlidesPageRoutingModule } from './afil-slides-routing.module';

import { AfilSlidesPage } from './afil-slides.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AfilSlidesPageRoutingModule
  ],
  declarations: [AfilSlidesPage]
})
export class AfilSlidesPageModule {}
