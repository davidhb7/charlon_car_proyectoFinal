import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FirebaseAuthService } from 'src/app/services/firebase-auth.service';
import { InteractionService } from 'src/app/services/interaction.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent  implements OnInit {

  formGroupInicioSesion: FormGroup;

  correoUsuarioLogin:string="";
  paseUsuarioLogin:string="";



  constructor(
    private formBuilderLogin: FormBuilder,
    private servicioAuth: FirebaseAuthService,
    private serviciosInteraccion: InteractionService,
    private router: Router,

  ) {
    correoUsuarioLogin:"";
    paseUsuarioLogin:"";
    this.inicializarCamposLogin();
  }

  ngOnInit() {
    return;
  }

    //INICIALIZAR CAMPOS
    inicializarCamposLogin(){
      this.formGroupInicioSesion = this.formBuilderLogin.group({
        correoUsuarioLogin: ['', [Validators.required, Validators.email]],
        paseUsuarioLogin:['', Validators.required]
      });
    }


  async iniciarSesion(){
    if(this.formGroupInicioSesion.valid){
      const resp = await this.servicioAuth.iniciarSesion(this.correoUsuarioLogin, this.paseUsuarioLogin).catch((er)=>{
        const errorCode = er.code;
        const errorMessage = er.message;
        this.serviciosInteraccion.mensajeGeneral("Inicio incorrecto. Correo o constraseña invalido");
        this.serviciosInteraccion.cerrarCargando();
        console.log("res:"+resp)
      });
      console.log("res:"+resp)
      if(resp){
        this.goToMenu();
        // this.serviciosInteraccion.mensajeGeneral("Inicio correcto");
        // this.serviciosInteraccion.cerrarCargando();
        // this.inicializarCamposLogin();
        // console.log("res:"+resp)
      }

    }
  }

  goToMenu(){
    this.router.navigate(['/lista-viajes']);
    console.log("Autenticado")
  }


}
