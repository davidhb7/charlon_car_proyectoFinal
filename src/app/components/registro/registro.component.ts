import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioI } from 'src/app/interfaces/usuario';
import { FirebaseAuthService } from 'src/app/services/firebase-auth.service';
import { FirestoreDataService } from 'src/app/services/firestore-data.service';
import { InteractionService } from 'src/app/services/interaction.service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.scss'],
})
export class RegistroComponent  implements OnInit {

  //VARIABLES
  nuevoUsuario!:UsuarioI;
  pase:string=""
  formGroupRegistro: FormGroup
  // passwordMismatch!:boolean

  constructor(
    private formBuilderRegistro: FormBuilder,
    private servicioAuth: FirebaseAuthService,
    private firesStoreServices: FirestoreDataService,
    private serviciosInteraccion: InteractionService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.inicializarUsuario();
  }


  inicializarUsuario(){
    this.nuevoUsuario={
      id:'',
      cedula:'',
      nombre:'',
      correo:'',
      edad:'',
      celular:'',
      marcaVehiculo:'',
      modelo:'',
      placa:'',
      ciudadRegistrado:''
    }
    this.formGroupRegistro = this.formBuilderRegistro.group({
      cedula:['', (Validators.required, Validators.pattern('[0-9]*'))],
      nombre:['', [Validators.required]],
      correo:['', [Validators.required, Validators.email]],
      edad:['', (Validators.required, Validators.pattern('[0-9]*'))],
      celular:['', (Validators.required, Validators.pattern('[0-9]*'))],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]

    }, { validator: this.passwordMatchValidator });
  }





  passwordMatchValidator(formGroup: AbstractControl): ValidationErrors | null {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;
    if (password !== confirmPassword) {
      return { passwordMismatch: true };
    }
    return null;
  }


  async guardar(){
    if(this.formGroupRegistro.valid){
      const resp= await this.servicioAuth.registrarUsuario(this.nuevoUsuario.correo, this.nuevoUsuario.celular);
      if(resp){
        this.serviciosInteraccion.mensajeGeneral("Usuario registrado correctamente");
        await this.firesStoreServices.crearDocumentoGeneralPorID(this.nuevoUsuario,'Usuarios', resp.user.uid.toString());
      }
    }
    this.router.navigate(['/login'])
  }

}
