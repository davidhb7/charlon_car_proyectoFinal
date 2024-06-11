import { Component, Input, OnInit } from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';
import { firstValueFrom } from 'rxjs';
import { FirebaseAuthService } from 'src/app/services/firebase-auth.service';
import { FirestoreDataService } from 'src/app/services/firestore-data.service';

@Component({
  selector: 'app-seccion-pasajero',
  templateUrl: './seccion-pasajero.component.html',
  styleUrls: ['./seccion-pasajero.component.scss'],
})
export class SeccionPasajeroComponent  implements OnInit {

  @Input() tipo: string;
  viajes: any[] = [];

  viajes2: any[] = [];
  pagoHecho: boolean = false;

  cargando: boolean = false;

  constructor(private serviciosFirebase: FirestoreDataService, public serviciosAuth: FirebaseAuthService) {

  }

  ngOnInit() {
    
    this.inicio();
    this.cargarViajesSolicitados();
  }

  convertTimestampToDate(timestamp: Timestamp): Date {
    return new Date(timestamp.seconds * 1000);
  }

  inicio(){

    this.cargando = true;
    this.serviciosFirebase.getAllViajes().subscribe(viajes => {
      this.viajes = viajes.map(viaje => {
        return {
          ...viaje,
          fechaInicio: this.convertTimestampToDate(viaje.fechaInicio),
          horaInicio: viaje.horaInicio
        };
      });
      console.log('Viajes obtenidos:', this.viajes);
    });

    this.cargando = false;
  }

  async solicitarPuesto(viajeId: string) {
    this.cargando = true;
    try {
      await this.serviciosFirebase.agregarPasajeroAViaje(viajeId);
      alert("Puesto solicitado correctamente");
      console.log('Puesto solicitado correctamente');
    } catch (error) {
      alert('Error al solicitar puesto:' + error);
      console.error('Error al solicitar puesto:', error);
    } finally {
      this.cargando = false;
    }
  }

  async cargarViajesSolicitados() {
    try {
        const viajesSolicitados = await this.serviciosFirebase.getViajesSolicitados();
        const user = await firstValueFrom(this.serviciosAuth.obtenerUsuarioActual());
        const userId = user.uid;

        this.viajes2 = viajesSolicitados.map(viaje => {
            const pasajero = viaje.pasajeros.find((p: { usuarioId: any; }) => p.usuarioId === userId);
            const pagoPendiente = pasajero ? !pasajero.pagoHecho : false;

            return {
                ...viaje,
                fechaInicio: this.convertTimestampToDate(viaje.fechaInicio),
                horaInicio: viaje.horaInicio,
                pagoPendiente: pagoPendiente
            };
        });

        console.log('Viajes solicitados:', this.viajes2);
    } catch (error) {
        console.error('Error al obtener los viajes solicitados:', error);
    }
}

  async pagarViaje(viajeId: string) {

    this.cargando = true;
    const user = await firstValueFrom(this.serviciosAuth.obtenerUsuarioActual());
    const pasajeroId = user.uid;

    try {
      const viaje = this.viajes2.find(v => v.id === viajeId);
      if (viaje) {
        const pasajeroIndex = viaje.pasajeros.findIndex((p: { usuarioId: string; }) => p.usuarioId === pasajeroId);
        if (pasajeroIndex !== -1) {
          viaje.pasajeros[pasajeroIndex].pagoHecho = true;

          this.pagoHecho = viaje.pasajeros[pasajeroIndex].pagoHecho;

          await this.serviciosFirebase.updateDocument('viajes', viajeId, { pasajeros: viaje.pasajeros });
          alert("Pago realizado!");
          //this.cargarViajesSolicitados(); // Actualiza la vista
        }
      }
    } catch (error) {
      console.error('Error al pagar el viaje:', error);
    }
    this.cargando = false;
  }

  async verificarPagoHecho(viaje: any): Promise<boolean> {
    const user = await firstValueFrom(this.serviciosAuth.obtenerUsuarioActual());
    const userId = user.uid;
    const pasajero = viaje.pasajeros.find((p: { usuarioId: any; }) => p.usuarioId === userId);
    return pasajero ? pasajero.pagoHecho : false;
  }

  generarLinkGoogleMaps(waypoints: any[]): string {
    if (!waypoints || waypoints.length < 2) {
      return '';
    }

    const origin = `${waypoints[0].lat},${waypoints[0].lng}`;
    const destination = `${waypoints[waypoints.length - 1].lat},${waypoints[waypoints.length - 1].lng}`;
    const waypointsStr = waypoints.slice(1, -1).map(point => `${point.lat},${point.lng}`).join('|');

    let googleMapsLink = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}`;
    if (waypointsStr) {
      googleMapsLink += `&waypoints=${waypointsStr}`;
    }

    return googleMapsLink;
  }

}
