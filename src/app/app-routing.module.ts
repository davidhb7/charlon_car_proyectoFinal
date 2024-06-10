import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { ListaViajesComponent } from './components/lista-viajes/lista-viajes.component';
import { RegisterComponent } from './pages/register/register.component';
import { LoginComponent } from './pages/login/login.component';
import { MenuComponent } from './components/menu/menu.component';
import { FormularioConductorComponent } from './pages/formulario-conductor/formulario-conductor.component';
import { InicioComponent } from './pages/inicio/inicio.component';
import { MapaViajeComponent } from './components/mapa-viaje/mapa-viaje.component';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  //POR DEFECTO O VACIO
  {
    path: 'register',
    component: RegisterComponent
  },
  {

    path: 'inicio',
    component: InicioComponent

  },
  {
    path:'login',
    component:LoginComponent
  },
  {
    path:'lista-viajes',
    component: ListaViajesComponent
  },
  {
    path:'menu',
    component: MenuComponent
  },
  {
    path:'formulario-conductor',
    component: FormularioConductorComponent
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'mapa-viaje', // Ruta donde deseas utilizar el componente
    component: MapaViajeComponent // Componente que deseas utilizar en esta ruta
  },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  
  exports: [RouterModule]
})
export class AppRoutingModule { }
