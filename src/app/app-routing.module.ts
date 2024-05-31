import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { ListaViajesComponent } from './components/lista-viajes/lista-viajes.component';
import { RegisterComponent } from './pages/register/register.component';
import { LoginComponent } from './pages/login/login.component';
import { MenuComponent } from './components/menu/menu.component';

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
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
