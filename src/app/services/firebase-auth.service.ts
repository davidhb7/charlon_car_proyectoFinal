import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword} from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class FirebaseAuthService {

  constructor(
    private fireAuth: Auth,
  ) { }


  registrarUsuario(correo:string, contrapase:string){
    return createUserWithEmailAndPassword(this.fireAuth, correo, contrapase)
  }


  iniciarSesion(correo:string, contrapase:string){
    return signInWithEmailAndPassword(this.fireAuth,correo, contrapase)
  }


}
