import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
// tslint:disable-next-line:max-line-length
import { icon, latLng, Layer, marker, tileLayer, Popup, LatLng, Marker, Polyline, PolylineOptions, LayerGroup, Map, point, FitBoundsOptions } from 'leaflet';
import { TelemetryService } from '../services/telemetry.service';
import { TelemetryObject } from '../models/objects/TelemetryObject';
import { LineString } from 'geojson';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  activeMap: Map;
  lineOptions = {color: 'blue', smoothFactor: 2.0};
  currentPosition =  latLng(46.879966, 8.726909);
  markers: LayerGroup = new LayerGroup();
  line: Polyline = new Polyline([], this.lineOptions);

  predictionMarkers: LayerGroup = new LayerGroup();
  predictionLine: Polyline = new Polyline([], this.lineOptions);

  fitBoundOptions: FitBoundsOptions = { maxZoom : 5, animate: true};

  LAYER_OSM = tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: 'Open Street Map'
    });
  // Layers control object with one base layer and the two overlay layers
  layersControl = {
    baseLayers: {
      'Open Street Map': this.LAYER_OSM
    },
    overlays: {
       'Pakete': this.markers,
       'Zurückgelegter Weg': this.line
    }
  };

  // Set the initial set of displayed layers (we could also use the leafletLayers input binding for this)
  options = {
    layers: [ this.LAYER_OSM, this.markers, this.line ],
    zoom: 7,
    center: latLng([ 46.879966, 8.726909 ])
  };

  // tslint:disable-next-line:max-line-length
  constructor(private telemetryService: TelemetryService) {
    this.telemetryService.getTelemetryObservable().subscribe((teleObjects) => {
        teleObjects.forEach((teleObject) => {
          this.addMarkerFromTelemetryObject(teleObject);
        });
        this.addLinesBetweenMarkers();

        if (this.activeMap) {
          console.log('Called fit to bounds');
          this.activeMap.fitBounds(this.line.getBounds(), this.fitBoundOptions);
        }
      });
  }

  ngOnInit() {

  }

  addMarkerFromTelemetryObject(teleObj: TelemetryObject) {
    const popup = this.createPopupFromTelemetryObject(teleObj);
    const newMarker = new Marker(
        [ teleObj.lat, teleObj.lon ],
        {
            icon: icon({
                iconSize: [ 25, 41 ],
                iconAnchor: [ 13, 41 ],
                iconUrl: 'assets/marker-icon.png',
                shadowUrl: 'assets/marker-shadow.png'
            })
        }
    );
    newMarker.bindPopup(popup);
    this.markers.addLayer(newMarker);
  }

  addLinesBetweenMarkers() {
    for (let index = 0; index < this.markers.getLayers().length; index++) {
      if (index < this.markers.getLayers().length) {
        const currentMarker = this.markers.getLayers()[index] as Marker;
        this.line.addLatLng(currentMarker.getLatLng());
      }
    }
  }

  createPopupFromTelemetryObject(teleObj: TelemetryObject): string {
    const popup =
    '<div class="card">'
    + '<div class="card-header unique-color lighten-1 white-text">'
    + ' Parameter'
    + '</div>'
    + '<div class="card-body">'
    + '  <div class="row">'
    + '    <div class="col-sm">'
    + ' <i class="material-icons">access_time</i>'
    + '    </div>'
    + '    <div class="col-sm">'
    + teleObj.getTimestampConverted().value
    + '    </div>'
    + '  </div>'
    + '  <div class="row">'
    + '    <div class="col-sm">'
    + '<i class="material-icons">trending_up</i>'
    + '    </div>'
    + '    <div class="col-sm">'
    + teleObj.getAlt().value + '' + teleObj.getAlt().unit
    + '    </div>'
    + '  </div>'
    + '</div>'
    + '</div>';
    return popup;
  }

  removeMarker() {
      this.markers.getLayers().pop();
  }

  onMapReady(map: Map) {
    this.activeMap = map;
}
}
