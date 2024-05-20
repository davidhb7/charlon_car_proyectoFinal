import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RegistroRoutingModule } from './registro-routing.module';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RegistroComponent } from './registro.component';


@NgModule({
  declarations: [
    //RegistroComponent
  ],

  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RegistroRoutingModule
  ]
})
export class RegistroModule { }
