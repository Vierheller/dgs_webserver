import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { icon, latLng, Layer, marker, tileLayer } from 'leaflet';
import { TelemetryService } from '../services/telemetry.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  options = {
      layers: [
          tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '...' })
      ],
      zoom: 5,
      center: latLng(46.879966, -121.726909)
  };

  markers: Layer[] = [];
  // tslint:disable-next-line:max-line-length
  constructor(private telSvc: TelemetryService) {
  }

  ngOnInit() {

  }

  addMarker(lat: number, lng: number) {
    const newMarker = marker(
        [ lat, lng ],
        {
            icon: icon({
                iconSize: [ 25, 41 ],
                iconAnchor: [ 13, 41 ],
                iconUrl: 'assets/marker-icon.png',
                shadowUrl: 'assets/marker-shadow.png'
            })
        }
    );
    this.markers.push(newMarker);
  }

    removeMarker() {
      this.markers.pop();
    }
}
