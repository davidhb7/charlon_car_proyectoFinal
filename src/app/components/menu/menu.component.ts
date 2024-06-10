import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FirebaseAuthService } from 'src/app/services/firebase-auth.service';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,],
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {

  constructor(
    private serviciosAuth: FirebaseAuthService,
    private router: Router,
  ) {

    this.usuarioLog();

  }

  ngOnInit() {

    return;
  }

  cerrarSesion() {
    this.serviciosAuth.salida();
    this.serviciosAuth.estadoLogUsuario();
    this.router.navigate(['/login']);
  }


  redireccionar(direccion: string) {
    this.router.navigate([direccion]);
  }

  usuarioLog() {

    console.log(this.serviciosAuth.verificarSesionActiva());

  }

}
