import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MapaViajeComponent } from '../mapa-viaje/mapa-viaje.component';
import { MatDialogRef } from '@angular/material/dialog';
import { FirebaseAuthService } from 'src/app/services/firebase-auth.service';
import { FirestoreDataService } from 'src/app/services/firestore-data.service';
import { firstValueFrom } from 'rxjs';



@Component({
  selector: 'app-seccion-conductor',
  templateUrl: './seccion-conductor.component.html',
  styleUrls: ['./seccion-conductor.component.scss'],
})
export class SeccionConductorComponent implements OnInit {

  @Input() tipo: string;
  formGroup: FormGroup;
  waypoints: { lat: number, lng: number }[] = [];
  await: any;
  viajes: any[] = [];
  cargando: boolean = false;

  ngOnInit() {

    this.cargarViajesCreados();

  }

  constructor(private fb: FormBuilder, private dialog: MatDialog, private serviciosAuth: FirebaseAuthService, private serviciosFirebase: FirestoreDataService) {
    this.formGroup = this.fb.group({
      puntoPartida: ['', Validators.required],
      destino: ['', Validators.required],
      fechaInicio: ['', Validators.required],
      horaInicio: ['', Validators.required],
      sillasDisponibles: [null, [Validators.required, Validators.min(1)]],
      precio: [null, [Validators.required, Validators.min(1)]]
    });
  }

  openMapModal(): void {
    const dialogRef = this.dialog.open(MapaViajeComponent, {
      width: '80%',
      height: '80%',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.waypoints = result;
        console.log('Puntos seleccionados:', this.waypoints);
      }
    });
  }

  async guardarViaje(): Promise<void> {
    this.cargando = true;
    if (this.formGroup.valid && this.waypoints.length === 5) {

      const conductor = await this.obtenerUsuario();

      if (conductor) {
        const viaje = {
          puntoPartida: this.formGroup.value.puntoPartida,
          destino: this.formGroup.value.destino,
          fechaInicio: this.formGroup.value.fechaInicio,
          horaInicio: this.formGroup.value.horaInicio,
          sillasDisponibles: this.formGroup.value.sillasDisponibles,
          precio: this.formGroup.value.precio,
          waypoints: this.waypoints,
          conductor: conductor.nombre,
          telefonoConductor: conductor.celular,
          cedula: conductor.cedula,
          marcaCarro: conductor.marcaVehiculo,
          colorCarro: conductor.color,
          placaCarro: conductor.placa,
          pasajeros: [] as any[],
        };
        console.log('Viaje a guardar:', viaje);

        try {
          // Agregar el viaje a la colección "viajes"
          const viajeId = await this.serviciosFirebase.agregarDocumentoConIDAutomatico('viajes', viaje);
          console.log('ID del viaje guardado:', viajeId);

          // Actualizar el usuario con el ID del viaje
          const viajesUsuario = conductor.viajes ? conductor.viajes : [];
          viajesUsuario.push(viajeId);

          const user = await firstValueFrom(this.serviciosAuth.obtenerUsuarioActual());

          await this.serviciosFirebase.actualizarDocumentoPorID('usuarios', user.uid, { viajes: viajesUsuario });
          console.log('Usuario actualizado con el nuevo ID de viaje');

          alert("Se ha creado el viaje correctamente.")

        } catch (error) {
          alert("Error el crear el viaje");
          console.error('Error al guardar el viaje o actualizar el usuario:', error);
        }

      } else {
        alert("Error el crear el viaje");
        console.error('No se pudo obtener el usuario');
      }
    } else {
      alert("Error el crear el viaje");
      console.error('Formulario inválido o puntos insuficientes');
    }

    this.cargando = false;
  }

  async obtenerUsuario(): Promise<any> {
    this.cargando = true;
    try {
      const user = await firstValueFrom(this.serviciosAuth.obtenerUsuarioActual());
      if (user) {
        const conductorDoc = await this.serviciosFirebase.getDocumentSolo("usuarios", user.uid);
        this.cargando = false;
        return conductorDoc;
      }
      this.cargando = false;
      return null;
    } catch (error) {
      this.cargando = false;
      console.error('Error obteniendo el usuario:', error);
      return null;
    }
    
  }

  async cargarViajesCreados() {
    this.cargando = true;
    try {
      const user = await firstValueFrom(this.serviciosAuth.obtenerUsuarioActual());
      if (user) {
        const usuario = await this.serviciosFirebase.getDocumentSolo('usuarios', user.uid);
        const viajesIds = usuario['viajes'] || [];
        const viajesPromises = viajesIds.map((viajeId: string) => this.serviciosFirebase.getDocumentSolo('viajes', viajeId));
        this.viajes = await Promise.all(viajesPromises);
      }
    } catch (error) {
      console.error('Error al obtener los viajes creados:', error);
    }
    this.cargando = false;
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
