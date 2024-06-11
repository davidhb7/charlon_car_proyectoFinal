import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-mapa-viaje',
  templateUrl: './mapa-viaje.component.html',
  styleUrls: ['./mapa-viaje.component.scss'],
})
export class MapaViajeComponent implements OnInit {

  map: L.Map;
  markers: L.Marker[] = [];
  waypoints: { lat: number, lng: number }[] = [];

  constructor(public dialogRef: MatDialogRef<MapaViajeComponent>) { }

  ngOnInit(): void {
    this.initMap();

    // Event listener for map click
    this.map.on('click', (e: L.LeafletMouseEvent) => {
      if (this.markers.length < 5) {
        const marker = L.marker(e.latlng).addTo(this.map);
        this.markers.push(marker);
        this.waypoints.push({ lat: e.latlng.lat, lng: e.latlng.lng });
        console.log(`Punto ${this.markers.length}:`, e.latlng);

        // Check if all points are selected
        if (this.markers.length === 5) {
          console.log('Todos los puntos seleccionados:', this.waypoints);
        }
      }
    });
  }

  private initMap(): void {
    this.map = L.map('map', {
      center: [3.4516, -76.5320],
      zoom: 18
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);
  }

  guardarRuta(): void {
    console.log('Guardando ruta:', this.waypoints);
    // Implementar lógica para guardar la ruta en la base de datos
  }

  cerrar(): void {
    this.dialogRef.close(this.waypoints);
  }

}
