import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { UsuarioI } from 'src/app/interfaces/usuarioI';
import { FirebaseAuthService } from 'src/app/services/firebase-auth.service';
import { FirestoreDataService } from 'src/app/services/firestore-data.service';

@Component({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule
  ],
  standalone: true,
  selector: 'app-register',
  templateUrl:'./register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {

  //OBJETOS-CLASES
  formGroupRegistro: FormGroup;


  //----------------VARIABLES
  fechaHoy: Date = new Date();
  cargando: boolean = false;
  pase: string = ""

  constructor(
    private formBuilderRegistro: FormBuilder,
    private serviciosAuth: FirebaseAuthService,
    private servicioFireStore: FirestoreDataService,
    private router: Router
  ) {
    //this.inicializarusuario();
  }

  ngOnInit() {
    this.formGroupRegistro = this.formBuilderRegistro.group({
      cedula: ['', Validators.required],
      nombre: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      contraseña: ['', Validators.required],
      edad: ['', Validators.required],
      celular: ['', Validators.required],
      tipo: ['', Validators.required],
      marcaVehiculo: [''],
      modelo: [''],
      placa: [''],
      ciudadRegistrado: [''],
      color: ['']
    });

    // Agregar validación condicional para los campos del conductor
    this.formGroupRegistro.get('tipo').valueChanges.subscribe(value => {
      if (value === 'conductor') {
        this.formGroupRegistro.get('marcaVehiculo').setValidators(Validators.required);
        this.formGroupRegistro.get('modelo').setValidators(Validators.required);
        this.formGroupRegistro.get('placa').setValidators(Validators.required);
        this.formGroupRegistro.get('ciudadRegistrado').setValidators(Validators.required);
        this.formGroupRegistro.get('color').setValidators(Validators.required);
      } else {
        this.formGroupRegistro.get('marcaVehiculo').clearValidators();
        this.formGroupRegistro.get('modelo').clearValidators();
        this.formGroupRegistro.get('placa').clearValidators();
        this.formGroupRegistro.get('ciudadRegistrado').clearValidators();
        this.formGroupRegistro.get('color').clearValidators();
      }
      this.formGroupRegistro.get('marcaVehiculo').updateValueAndValidity();
      this.formGroupRegistro.get('modelo').updateValueAndValidity();
      this.formGroupRegistro.get('placa').updateValueAndValidity();
      this.formGroupRegistro.get('ciudadRegistrado').updateValueAndValidity();
      this.formGroupRegistro.get('color').updateValueAndValidity();
    });
  }

  /*
  inicializarusuario() {
    this.nuevoUsuario = {
      id: '',
      cedula: '',
      nombre: '',
      correo: '',
      edad: '',
      celular: '',
      tipo: '',
      marcaVehiculo: '',
      modelo: '',
      placa: '',
      ciudadRegistrado: '',
      color: ''
    };
    this.formGroupRegistro = this.formBuilderRegistro.group({
      nombre: ['', [Validators.required]],
      correo: ['', [Validators.required, Validators.email]],
      clave: ['', [Validators.required]],
    });
  }

    
  async guardarUsuarioRegistro() {
    this.cargando = true;
    const resp = await this.serviciosAuth.registrarUsuario(this.nuevoUsuario.correo, this.nuevoUsuario.tipo);
    if (resp) {
      console.log("Registro realizado")
      this.nuevoUsuario.id = resp.user.uid;
      await this.servicioFireStore.crearDocumentoGeneralPorID(this.nuevoUsuario, 'Usuarios', resp.user.uid.toString());
    }
    this.router.navigate(['/login']);
    this.cargando = false;
  }*/

  async guardarUsuarioRegistro() {
    this.cargando = true;
    if (this.formGroupRegistro.valid) {
      const usuarioData = { ...this.formGroupRegistro.value };
      const { correo, contraseña, ...dataSinContraseña } = usuarioData;

      const userCredential = await this.serviciosAuth.registrarUsuario(correo, contraseña);

      if (userCredential && userCredential.user) {
        
        const userId = userCredential.user.uid;
        const usuarioDocRef = await this.servicioFireStore.crearDocumentoGeneral(dataSinContraseña, `usuarios/${userId}`);
        //await setDoc(usuarioDocRef, dataSinContraseña);
        alert("Usuario registrado correctamente. Ya puede iniciar sesión")
        console.log('Usuario registrado con éxito:', dataSinContraseña);
      } else {
        this.cargando = false;
        alert("Error al registrar");
        console.error('Error de registro:');
      }
    } else {
      this.cargando = false;
      alert("Error al registrar");
      console.log('Formulario no válido');
    }
  }


}
