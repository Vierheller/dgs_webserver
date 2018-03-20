import { Component, OnInit, AfterViewInit, ViewChild, OnDestroy } from '@angular/core';
// tslint:disable-next-line:max-line-length
import { icon, latLng, Layer, marker, tileLayer, Popup, LatLng, Marker, Polyline, PolylineOptions, LayerGroup, Map, point, FitBoundsOptions } from 'leaflet';
import { TelemetryService } from '../services/telemetry.service';
import { TelemetryObject } from '../models/objects/TelemetryObject';
import { LineString } from 'geojson';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit, OnDestroy {
  private activeMap: Map;
  private subscription: Subscription;
  private lineOptions = {color: 'blue', smoothFactor: 2.0};
  private currentPosition =  latLng(46.879966, 8.726909);
  private markers: LayerGroup = new LayerGroup();
  private line: Polyline = new Polyline([], this.lineOptions);

  private predictionMarkers: LayerGroup = new LayerGroup();
  private predictionLineOptions = {color: 'red', smoothFactor: 2.0};
  private predictionLine: Polyline = new Polyline([], this.predictionLineOptions);

  private fitBoundOptions: FitBoundsOptions = {animate: true};

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
       'Zurückgelegter Weg': this.line,
       'Landepunkt (Vorhersage)': this.predictionMarkers,
       'Luftlinie Landepunkt': this.predictionLine
    }
  };

  // Set the initial set of displayed layers (we could also use the leafletLayers input binding for this)
  options = {
    layers: [ this.LAYER_OSM, this.markers, this.line, this.predictionMarkers, this.predictionLine ],
    zoom: 10,
    center: latLng([ 46.879966, 8.726909 ])
  };

  // tslint:disable-next-line:max-line-length
  constructor(private telemetryService: TelemetryService) {
    console.log('Map component created');

    this.subscription = this.telemetryService.getAllTelemetrys().subscribe((teleObjects) => {
      console.log('GOT MAP DATA');
      teleObjects.forEach((teleObject) => {
        this.addMarkerFromTelemetryObject(teleObject);
      });
      this.addLinesBetweenMarkers();
      this.addPredictionMarker(teleObjects[teleObjects.length - 1]);
      this.addPredictionLine(teleObjects[teleObjects.length - 1]);
      console.log('Length' + teleObjects.length + ' Marker Count: ' + this.markers.getLayers().length);
      if (this.activeMap) {
        this.activeMap.invalidateSize();
        this.activeMap.fitBounds(this.line.getBounds(), this.fitBoundOptions);
      }
    });
  }

  ngOnInit() {

    if (this.activeMap) {
      this.activeMap.invalidateSize();
      this.activeMap.fitBounds(this.line.getBounds(), this.fitBoundOptions);
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  createMarkerFromTelemetryObject(teleObj: TelemetryObject): Marker {
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
    return newMarker;
  }

  addMarkerFromTelemetryObject(teleObj: TelemetryObject) {
    if (this.isMarkerNeededToBeDrawn(teleObj)) {
      this.markers.addLayer(this.createMarkerFromTelemetryObject(teleObj));
    }
  }

  isMarkerNeededToBeDrawn(teleObj: TelemetryObject): boolean {
    // Gültiges Lat Lng?
    let result = (teleObj.lat !== 0 && teleObj.lon !== 0);

    if (result && this.markers.getLayers().length > 2) {
      // Gültiges Lat Lng vorhanden
      const lastMarker = this.markers.getLayer(this.markers.getLayers().length - 1) as Marker;
      if (lastMarker) {
        // Differenz zum letzten Marker ermitteln
        const latDiff = Math.abs(lastMarker.getLatLng().lat - teleObj.lat);
        const lonDiff = Math.abs(lastMarker.getLatLng().lng - teleObj.lon);
        // Differenz zu klein?
        result = (latDiff > 0.01 && lonDiff > 0.01);
        console.log('LATDIFF: ' + latDiff + 'LONDIFF' + lonDiff + 'RESULT: ' + result);
      }
    }
    return result;
  }

  addLinesBetweenMarkers() {
    for (let index = 0; index < this.markers.getLayers().length; index++) {
      if (index < this.markers.getLayers().length) {
        const currentMarker = this.markers.getLayers()[index] as Marker;
        this.line.addLatLng(currentMarker.getLatLng());
      }
    }
  }

  addPredictionMarker(lastTelemetryObject: TelemetryObject) {
    if (this.predictionMarkers.getLayers().length > 0) {
      // this.predictionMarkers = this.predictionMarkers.removeLayer(0);
    }
    if (lastTelemetryObject.pred_lat !== 0 && lastTelemetryObject.pred_lng !== 0) {
      this.predictionMarkers.addLayer(this.createMarkerFromTelemetryObject(lastTelemetryObject));
    }
  }

  addPredictionLine(lastTelemetryObject: TelemetryObject) {
    if (lastTelemetryObject.pred_lat !== 0 && lastTelemetryObject.pred_lng !== 0) {
      this.predictionLine.addLatLng(latLng(lastTelemetryObject.lat, lastTelemetryObject.lon, lastTelemetryObject.alt));
      this.predictionLine.addLatLng(latLng(lastTelemetryObject.pred_lat, lastTelemetryObject.pred_lng));
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
