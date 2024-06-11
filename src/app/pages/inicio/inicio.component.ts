import { Component, NgModule, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FirebaseAuthService } from 'src/app/services/firebase-auth.service';
import { FirestoreDataService } from 'src/app/services/firestore-data.service';
import { Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MapaViajeModule } from 'src/app/components/mapa-viaje/mapa-viaje.module';
import { SeccionConductorModule } from 'src/app/components/seccion-conductor/seccion-conductor.module';
import { SeccionPasajeroModule } from 'src/app/components/seccion-pasajero/seccion-pasajero.module';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    MapaViajeModule,
    SeccionConductorModule,
    SeccionPasajeroModule
  ],

  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.scss'],
})
export class InicioComponent implements OnInit {

  usuarioLog: any;
  esConductor: boolean;
  cargando: boolean = false;

  tipo: string = 'viajes';

  constructor(private serviciosAuth: FirebaseAuthService, private serviciosFirebase: FirestoreDataService,
    private router: Router) {

    this.prueba();

  }

  ngOnInit(): void {
    // Verificar si hay una sesión activa
    this.cargando = true;
    this.serviciosAuth.verificarSesionActiva().subscribe(sesionActiva => {
      if (!sesionActiva) {
        // Si no hay una sesión activa, redirigir al inicio de sesión
        this.router.navigateByUrl('/login');
      }
    });

    // Obtener información sobre el usuario actual
    this.serviciosAuth.obtenerUsuarioActual().subscribe(async user => {
      if (user) {
        this.usuarioLog = await this.serviciosFirebase.getDocumentSolo("usuarios", user.uid);
        console.log('Usuario actual:', this.usuarioLog);

        if(this.usuarioLog.tipo == "pasajero"){

          this.esConductor = false;

        }else{

          this.esConductor = true;

        }

      }
    });
    this.cargando = false;
  }

  prueba() {
    console.log(this.serviciosAuth.verificarSesionActiva());
  }

  async cerrarSesion() {
    this.cargando = true;
    try {
      await this.serviciosAuth.salida();
      // Recargar la página
      window.location.reload();
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
    this.cargando = false;
  }

  cambioSegmento(event:any){

    if (event.detail.value === 'default') {
      this.tipo = "viajes"
    } else if (event.detail.value === 'segment') {
      this.tipo = "crear"
    }

  }

  cambioSegmento2(event:any){

    if (event.detail.value === 'default') {
      this.tipo = "buscar"
    } else if (event.detail.value === 'segment') {
      this.tipo = "misViajes"
    }

  }

}
