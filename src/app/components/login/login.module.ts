import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoginRoutingModule } from './login-routing.module';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { LoginComponent } from './login.component';


@NgModule({
  declarations: [
    //LoginComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LoginRoutingModule
  ]
})
export class LoginModule { }
