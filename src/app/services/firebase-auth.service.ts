import { Injectable } from '@angular/core';
import {AngularFireAuth} from '@angular/fire/compat/auth'

@Injectable({
  providedIn: 'root'
})
export class FirebaseAuthService {

  constructor(
    //private fireAuth: Auth,
    private angularFireAuth: AngularFireAuth,
  ) { }


  async registrarUsuario(correo:string, contrapase:string){
    return await this.angularFireAuth.createUserWithEmailAndPassword(correo,contrapase);
  }


  async iniciarSesion(correo:string, contrapase:string){
    return await this.angularFireAuth.signInWithEmailAndPassword(correo,contrapase);
  }

  async salida(){
    return await this.angularFireAuth.signOut();
  }

  estadoLogUsuario(){
    return this.angularFireAuth.authState;
  }



}
