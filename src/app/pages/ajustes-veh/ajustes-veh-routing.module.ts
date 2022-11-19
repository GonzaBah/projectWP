import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AjustesVehPage } from './ajustes-veh.page';

const routes: Routes = [
  {
    path: '',
    component: AjustesVehPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AjustesVehPageRoutingModule {}
