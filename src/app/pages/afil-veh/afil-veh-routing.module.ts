import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AfilVehPage } from './afil-veh.page';

const routes: Routes = [
  {
    path: '',
    component: AfilVehPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AfilVehPageRoutingModule {}
