import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NewViajePage } from './new-viaje.page';

const routes: Routes = [
  {
    path: '',
    component: NewViajePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NewViajePageRoutingModule {}
