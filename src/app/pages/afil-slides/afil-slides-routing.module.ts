import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AfilSlidesPage } from './afil-slides.page';

const routes: Routes = [
  {
    path: '',
    component: AfilSlidesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AfilSlidesPageRoutingModule {}
