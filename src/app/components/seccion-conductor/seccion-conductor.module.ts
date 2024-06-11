import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SeccionConductorComponent } from './seccion-conductor.component';
import { IonicModule } from '@ionic/angular';

import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';

// Importaciones de Angular Material
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';



@NgModule({
  declarations: [SeccionConductorComponent],
  imports: [
    CommonModule,
    IonicModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDialogModule
  ],
  exports: [SeccionConductorComponent]
})
export class SeccionConductorModule { }
