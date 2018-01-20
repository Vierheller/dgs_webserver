import {TelemetryService} from '../telemetry.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ActionType, AcEntity } from 'angular-cesium';
import { Subscriber } from 'rxjs/Subscriber';
import { TelemetryInternal } from '../../models/Telemetry';
import { AcNotification } from 'angular-cesium/src/angular-cesium/models/ac-notification';
import { JsonMapper } from 'angular-cesium/src/angular-cesium/services/json-mapper/json-mapper.service';

@Injectable()
export class CesiumProviderService {
  public data: AcNotification[];
  constructor(private telemetrieService: TelemetryService) {
    this.data = new Array<AcNotification>();
    console.log('CESIUM PROVICER CREATED');

    /*this.telemetrieService.getData().subscribe((data) => {
      for (let index = 0; index < data.length; index++) {
        this.telemetrieService.getTelemetryById(data[index])
          .then((tele) => {
            console.log('CESIUM PROVIDER CREATED DATA COUNT');
              this.data.push(this.createCesiumPoint(tele));
          });
      }
    });*/
    this.data.push(this.createCesiumPoint(undefined));
  }

  get(): Observable<AcNotification> {
    console.log('LAST ' + JSON.stringify(this.data[this.data.length - 1]));
    return Observable.create((observer: Subscriber<any>) => {
      this.data.forEach((acNotification: any) => {
        observer.next(acNotification);
      });
    });
    // return obs;
    // const test: Observable<AcNotification> = Observable.from(this.data);
    // return test;
  }

  createCesiumPoint(t: TelemetryInternal): AcNotification {
    const acN: AcNotification = {
      // tslint:disable-next-line:indent
      /* id: '0',
      actionType: ActionType.ADD_UPDATE,
      entity: AcEntity.create({
        'id': 0,
        'isTarget': true,
        'callsign': 'track0',
        'image': '/assets/ic_add_a_photo_black_24dp.png',
        'color' : new Cesium.Color(1.0, 1.0, 0.0, 1.0),
        'heading': 0.23150836806679354,
        'position': new Cesium.Cartesian3.fromDegrees(8.50, 49.51874, 5000),
        'futurePosition': new Cesium.Cartesian3.fromDegrees(8.50, 49.51874, 5000)
      })
    };*/
      id: '0',
      actionType: ActionType.ADD_UPDATE,
      entity: AcEntity.create({
        name : 'Green wall from surface with outline',
        wall : {
            show: true,
            positions : Cesium.Cartesian3.fromDegreesArrayHeights([-107.0, 43.0, 100000.0,
                                                            -97.0, 43.0, 100000.0,
                                                            -97.0, 40.0, 100000.0,
                                                            -107.0, 40.0, 100000.0,
                                                            -107.0, 43.0, 100000.0]),
            material : Cesium.Color.GREEN,
            outline : true
        },
        show: true,
        positions : Cesium.Cartesian3.fromDegreesArrayHeights([-107.0, 43.0, 100000.0,
                                                        -97.0, 43.0, 100000.0,
                                                        -97.0, 40.0, 100000.0,
                                                        -107.0, 40.0, 100000.0,
                                                        -107.0, 43.0, 100000.0]),
        material : Cesium.Color.GREEN,
        outline : true
      })
    };
      /* tslint:disable-next-line:indent
       id: '0',
      actionType: ActionType.ADD_UPDATE,
      entity: AcEntity.create({
        point: {
          pixelSize : 15,
          color : new Cesium.Color(1.0, 1.0, 0.0, 1.0),
          position : new Cesium.Cartesian3.fromDegrees(t.lon, t.lat, t.alt)
        }
      })
    };*/
    return acN;
  }

}
