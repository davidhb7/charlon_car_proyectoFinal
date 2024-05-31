import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { UsuarioI } from 'src/app/interfaces/usuario';
import { FirebaseAuthService } from 'src/app/services/firebase-auth.service';
import { FirestoreDataService } from 'src/app/services/firestore-data.service';

@Component({
  imports:[
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule
  ],
  standalone:true,
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent  implements OnInit {

    //OBJETOS-CLASES
    formGroupRegistro: FormGroup;
    nuevoUsuario:UsuarioI;


    //----------------VARIABLES
    fechaHoy: Date = new Date();
    cargando:boolean=false;
    pase:string=""

  constructor(
    private formBuilderRegistro: FormBuilder,
    private serviciosAuth: FirebaseAuthService,
    private servicioFireStore:FirestoreDataService,
    private router: Router
  ) {
    this.inicializarusuario();
  }

  ngOnInit() {
    return;
  }

  inicializarusuario(){
    this.nuevoUsuario={
      id:'',
      cedula:'',
      nombre:'',
      correo:'',
      edad:'',
      celular:'',
      clave:'',
      marcaVehiculo:'',
      modelo:'',
      placa:'',
      ciudadRegistrado:''
    };
    this.formGroupRegistro = this.formBuilderRegistro.group({
      nombre: ['', [Validators.required]],
      correo: ['', [Validators.required, Validators.email]],
      clave: ['', [Validators.required]],
    });
  }

  async guardarUsuarioRegistro(){
    this.cargando=true;
    const resp= await this.serviciosAuth.registrarUsuario(this.nuevoUsuario.correo, this.nuevoUsuario.clave);
    if(resp){
      this.nuevoUsuario.id=resp.user.uid;
      await this.servicioFireStore.crearDocumentoGeneralPorID(this.nuevoUsuario,'Usuarios', resp.user.uid.toString());
    }
    this.router.navigate(['/login']);
    this.cargando=false;
  }


}
