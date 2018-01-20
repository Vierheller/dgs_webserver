import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
// tslint:disable-next-line:max-line-length
import {MapsManagerService, MapLayerProviderOptions, AcMapComponent, ViewerConfiguration, CameraService, AcNotification, AcPointComponent, AcLayerComponent} from 'angular-cesium';
import { Observable } from 'rxjs/Observable';
import { CesiumProviderService } from '../services/cesium-provider/cesium-provider.service';
import { SceneMode } from 'angular-cesium/src/angular-cesium/models/scene-mode.enum';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
  providers: [MapsManagerService, ViewerConfiguration]
})
export class MapComponent implements OnInit {
  @ViewChild(AcLayerComponent) layer: AcLayerComponent;
  private osmProvider: MapLayerProviderOptions;
  private map: AcMapComponent;
  private cameraService: CameraService;
  points: Observable<AcNotification>;
  show = true;
  // tslint:disable-next-line:max-line-length
  constructor(private mapsManagerService: MapsManagerService, private viewerConf: ViewerConfiguration, private cesiumProviderService: CesiumProviderService) {

    viewerConf.viewerOptions = {
      selectionIndicator : false,
      timeline : false,
      infoBox : false,
      fullscreenButton : false,
      baseLayerPicker : false,
      animation : false,
      homeButton : true,
      geocoder : false,
      navigationHelpButton : false,
      navigationInstructionsInitiallyVisible : false,
      imageryProvider: undefined
    };

    viewerConf.viewerModifier = (viewer: any) => {
      viewer.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
      viewer.bottomContainer.remove();
    };

    this.osmProvider = MapLayerProviderOptions.OpenStreetMap;
  }

  ngOnInit() {
    this.points = this.cesiumProviderService.get();
  }

  // tslint:disable-next-line:use-life-cycle-interface
  ngAfterViewInit() {
    this.map = this.mapsManagerService.getMap();
    console.log('FOUND MAP' + this.map.getId());
  }

  onClickMe() {
    /*if (!this.cameraService) {
      this.cameraService = this.mapsManagerService.getMap().getCameraService();
    }
    this.cameraService.cameraFlyTo({
      destination : Cesium.Cartesian3.fromDegrees(8.50, 49.51874, 5000),
      orientation : {
          heading : Cesium.Math.toRadians(0),
          pitch : Cesium.Math.toRadians(-45.0),
          roll : 0.0
      }
    });*/
    this.points = this.cesiumProviderService.get();
  }

}
