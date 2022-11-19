import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MapagooglePage } from './mapagoogle.page';

const routes: Routes = [
  {
    path: '',
    component: MapagooglePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MapagooglePageRoutingModule {}
