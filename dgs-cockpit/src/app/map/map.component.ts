import { Component, OnInit } from '@angular/core';
import { icon, latLng, Layer, marker, tileLayer, LatLng } from 'leaflet';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  // Open Street Map definitions
  LAYER_OSM = tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: 'Open Street Map' });

  // Values to bind to Leaflet Directive
  options = {
    layers: [ this.LAYER_OSM ],
    zoom: 10,
    center: latLng(49.49671, 8.47955)
  };

  markers: Layer[] = [];

  addMarker(position: LatLng) {
    const newMarker = marker(
    [ 49.49671 + 0.1 * (Math.random() - 0.5), 8.47955 + 0.1 * (Math.random() - 0.5) ],
      {
          icon: icon({
          iconSize: [ 25, 41 ],
          iconAnchor: [ 13, 41 ],
          iconUrl: '../assets/ic_burst_mode_black_24dp.png'
        })
      }
    );
    this.markers.push(newMarker);
  }

  removeMarker() {
    this.markers.pop();
  }

  constructor() { }

  ngOnInit() {
  }

}
