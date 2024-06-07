import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { UsuarioI } from 'src/app/interfaces/usuarioI';

@Component({
  standalone:true,
  imports:[
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
  ],
  selector: 'app-formulario-conductor',
  templateUrl: './formulario-conductor.component.html',
  styleUrls: ['./formulario-conductor.component.scss'],
})
export class FormularioConductorComponent  implements OnInit {

    //OBJETOS-CLASES
    formGroupRegistroConductor: FormGroup;
    nuevoConductor:UsuarioI;

    //----------------VARIABLES
    cargando:boolean=false;

  constructor(
    private formBuilderRegistroConductor: FormBuilder,
  ) {
    this.inicializarCamposConductor();
  }

  ngOnInit() {
    return;
  }

  inicializarCamposConductor(){
    this.nuevoConductor = {
      id:'',
      cedula:'',
      nombre:'',
      correo:'',
      edad:'',
      celular:'',
      clave:'',

      // COMO CONDUCTOR
      marcaVehiculo:'',
      modelo:'',
      placa:'',
      ciudadRegistrado:'',
      asientosDisponibles: 0
    };
    this.formGroupRegistroConductor = this.formBuilderRegistroConductor.group({
      marcaVehiculo:['', Validators.required],
      modelo: ['', Validators.required],
      placa: ['', Validators.required],
      ciudadRegistrado: ['',[ Validators.required]],
      asientosDisponibles: ['', [Validators.required, Validators.pattern('[0-9]*')]],

    });


  }

  guardarUsuarioConductorRegistro(){

  }


}
