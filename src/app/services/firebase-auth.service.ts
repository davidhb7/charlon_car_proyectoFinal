import { Injectable } from '@angular/core';
import {AngularFireAuth} from '@angular/fire/compat/auth'
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirebaseAuthService {

  constructor(
    //private fireAuth: Auth,
    private angularFireAuth: AngularFireAuth,
  ) { }


  async registrarUsuario(correo:string, contrapase:string){
    return await this.angularFireAuth.createUserWithEmailAndPassword(correo,contrapase)
    .catch(error=>{
      console.log("Error de registro"+ error);
      return null;
    });
  }


  async iniciarSesion(correo:string, contrapase:string){
    return await this.angularFireAuth.signInWithEmailAndPassword(correo,contrapase)
    .catch(error=>{
      console.log("Error de inicio de sesion"+ error);
    });
  }

  async salida(){

    return await this.angularFireAuth.signOut().catch(error=>{
      console.log("Error al cerrar sesion"+ error);
      this.estadoLogUsuario();
    });

  }

  estadoLogUsuario(){
    console.log(this.angularFireAuth.authState);
    return this.angularFireAuth.authState;
  }

  verificarSesionActiva(): Observable<boolean> {
    return this.angularFireAuth.authState.pipe(
      map(user => !!user) // Convierte el objeto de usuario en un booleano indicando si hay un usuario autenticado o no
    );
  }

  obtenerUsuarioActual(): Observable<any> {
    return this.angularFireAuth.authState;
  }

}
