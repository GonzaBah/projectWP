import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { MapaComponent } from './components/mapa/mapa.component';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'main',
    loadChildren: () => import('./pages/main/main.module').then( m => m.MainPageModule)
  },
  {
    path: 'perfil',
    loadChildren: () => import('./pages/perfil/perfil.module').then( m => m.PerfilPageModule)
  },
  {
    path: 'ajustes',
    loadChildren: () => import('./pages/ajustes/ajustes.module').then( m => m.AjustesPageModule)
  },
  {
    path: 'registro',
    loadChildren: () => import('./pages/registro/registro.module').then( m => m.RegistroPageModule)
  },
  {
    path: 'viajes',
    loadChildren: () => import('./pages/viajes/viajes.module').then( m => m.ViajesPageModule)
  },
  {
    path: 'new-viaje',
    loadChildren: () => import('./pages/new-viaje/new-viaje.module').then( m => m.NewViajePageModule)
  },
  {
    path: 'afil-slides',
    loadChildren: () => import('./pages/afil-slides/afil-slides.module').then( m => m.AfilSlidesPageModule)
  },
  {
    path: 'afil-veh',
    loadChildren: () => import('./pages/afil-veh/afil-veh.module').then( m => m.AfilVehPageModule)
  },
  {
    path: 'ajustes-veh',
    loadChildren: () => import('./pages/ajustes-veh/ajustes-veh.module').then( m => m.AjustesVehPageModule)
  },
  {
    path: 'mapagoogle', component: MapaComponent,
    loadChildren: () => import('./pages/mapagoogle/mapagoogle.module').then( m => m.MapagooglePageModule)
  },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
