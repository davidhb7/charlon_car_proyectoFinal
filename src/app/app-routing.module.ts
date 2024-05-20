import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { RegistroComponent } from './components/registro/registro.component';
import { LoginComponent } from './components/login/login.component';
import { ListaViajesComponent } from './components/lista-viajes/lista-viajes.component';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },



  //POR DEFECTO O VACIO
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'registro',
    component: RegistroComponent
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
    path:'login',
    component: LoginComponent
  },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
