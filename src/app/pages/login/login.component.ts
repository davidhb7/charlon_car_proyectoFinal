import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { UsuarioI } from 'src/app/interfaces/usuario';
import { FirebaseAuthService } from 'src/app/services/firebase-auth.service';

@Component({
  standalone:true,
  imports:[
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
  ],
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent  implements OnInit {

    //OBJETOS Y CLASES
    formLogin: FormGroup;
    usuario:UsuarioI

    //VARIABVLES
    correoUsuarioLogin:string="";
    paseUsuarioLogin:string="";
    alertarError: boolean=false;
    cargando:boolean;

  constructor(
    private formBuilderLogin: FormBuilder,
    private serviciosAuth: FirebaseAuthService,
    private router: Router,
  ) {
    this.inicializarCamposLogin();
  }

  ngOnInit() {
    return;
  }
  //INICIALIZAR CAMPOS
  inicializarCamposLogin(){
    this.formLogin = this.formBuilderLogin.group({
      correoUsuarioLogin: ['', [Validators.required, Validators.email]],
      paseUsuarioLogin:['', Validators.required]
    });
  }
  async iniciarSesion(){
    this.cargando=true;
    if(this.formLogin.valid){
      const resp= await this.serviciosAuth.iniciarSesion(this.correoUsuarioLogin, this.paseUsuarioLogin)
      .catch((er)=>{
        const errorCode = er.code;
        const errorMessage = er.message;
        console.log("Error auth");
        console.log("Error code"+errorCode);
        console.log("Error mensaje"+errorMessage);
        this.correoUsuarioLogin=""
        this.paseUsuarioLogin=""
      });
      if(resp){
        this.goToMenu();
        this.inicializarCamposLogin();
        this.goToMenu();
      }
    }
  }

  //REDIRECCION A MENU
  goToMenu(){
    this.router.navigate(['/menu']);
    console.log("Autenticado")
  }


}
