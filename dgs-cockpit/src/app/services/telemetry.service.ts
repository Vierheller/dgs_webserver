import {EventEmitter, Injectable} from '@angular/core';
import { DatabaseConnectorService } from './database-connector/database-connector.service';
import {TelemetryObject} from '../models/objects/TelemetryObject';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/shareReplay';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import { Promise } from 'bluebird';
/*
Design Document (erforderlich um die Query zu ermöglichen!!)
{
  "_id": "_design/telemetry",
  "views": {
    "allDocuments": {
      "map": "function(doc){ if (doc.data.type === 'telemetry'){ emit(doc._id, doc._rev, doc.data.timestamp)}}"
    }
  }
}
*/

@Injectable()
export class TelemetryService {
  private reloadSubject: BehaviorSubject<void> = new BehaviorSubject(void 0);
  private telemetryIDsObservable: Observable<Array<string>>;


  // [id, telemetryObject]
  private telemetryCache: Array<[string, TelemetryObject]>;

  // This Emitter thows events when new value was set on timeline
  public timelineEvent: EventEmitter<number>;

  // While this represents the current id - over all components
  public currentTelemetryIdSubject: BehaviorSubject<string> = new BehaviorSubject('');


  constructor(public dataService: DatabaseConnectorService) {
    this.timelineEvent = new EventEmitter<number>();

    this.telemetryCache = [];

    this.telemetryIDsObservable = this.reloadSubject.flatMap(_ => {
      return Observable.create(subscriber => {
        this.dataService.localDb.query('telemetry/allDocuments/')
        .then((data) => {
          const dataset = data.rows.map(row => {
            return row.id;
          });
          console.log('Dataset length: ' + dataset.length);
          subscriber.next(dataset);
          subscriber.complete();
        })
        .catch((error) => {
          console.log(error);
        });
      });
    }).shareReplay() as Observable<Array<string>>;

    this.dataService.localDb.changes({live: true, since: 'now', include_docs: true})
      .on('change', (change) => {
        const data: any = change.doc;
        if (data && data.data && data.data.type === 'telemetry') {
          this.reloadSubject.next(void 0);
        }
      });
  }

  getNextNTelemetry(currentTelemetryIndex: BehaviorSubject<number>, n: BehaviorSubject<number>) {
    return Observable.combineLatest(this.telemetryIDsObservable, currentTelemetryIndex, n)
      .flatMap((latest) => {
        return Observable.create(subscriber => {
          const [ids, current_index, current_size] = latest;
          const current_id = ids[current_index];
          const promises: Array<Promise<any>> = [];
          for (let i = current_index; i < Math.min(current_index + current_size, ids.length); i++) {
            if (!this.isInCache(ids[i])) {
              promises.push(this.dataService.localDb.get(ids[i]));
            }
          }
          Promise.all(promises).then(function (docs) {
            return docs.map(doc => [doc._id, TelemetryObject.createTelemetryObject(doc.data)]);
          })
          .then(tmtries => {
            this.telemetryCache = this.telemetryCache.concat(tmtries);
            subscriber.next(this.getNFromCache(current_id, current_size));
            subscriber.complete();
          })
          .catch((error) => { console.log(error); });
        });
      }).shareReplay() as Observable<Array<TelemetryObject>>;
  }

  private getNFromCache(current_id: string, n: number) {
      let counter = 0;
      const telemetries = [];
      for (const pair of this.telemetryCache){
          const [id, telemetry] = pair;
          if (counter < n) {
            return telemetries;
          }
          if (id === current_id || counter > 0) {
            telemetries.push(telemetry);
            counter++;
          }
      }
      return telemetries;
  }

  private isInCache(telemetryId: string) {
    for (const pair of this.telemetryCache) {
      const [id, telemetry] = pair;
      if (id === telemetryId) {
        return true;
      }
    }
    return false;
  }

  // Return Observable of the list of TelemetryIds
  getTelemetryIdsObservable(): Observable<Array<string>> {
    return this.telemetryIDsObservable;
  }

  getAllTelemetrys(): Observable<Array<TelemetryObject>> {
    return this.telemetryIDsObservable.flatMap((ids) => {
      return Observable.create(subscriber => {
        const promises: Array<Promise<any>> = [];
        for (const id of ids) {
          promises.push(this.dataService.localDb.get(id));
        }
        Promise.all(promises).then(function (docs) {
          return docs.map(doc => TelemetryObject.createTelemetryObject(doc.data));
        })
        .then(tmtries => { subscriber.next(tmtries); subscriber.complete(); } )
        .catch((error) => { console.log(error); });
      });
    }).shareReplay() as Observable<Array<TelemetryObject>>;
  }

  getTelemetryForCurrentId(): Observable<TelemetryObject> {
    return Observable.combineLatest(this.telemetryIDsObservable, this.currentTelemetryIdSubject)
      .flatMap((latest) => {
      return Observable.create(subscriber => {
        const [_, current_id] = latest;
        this.dataService.localDb.get(current_id)
          .then((result) => {
            const doc = result as any;
            const telemetry = TelemetryObject.createTelemetryObject(doc.data);
            subscriber.next(telemetry); subscriber.complete();
          })
          .catch((error) => {console.log(error); });
      });
    }).shareReplay() as Observable<TelemetryObject>;
  }

  getTelemetryById(id: string): Promise<TelemetryObject> {
    if (id) {
    return this.dataService.localDb.get(id)
      .then(function (doc) {
        const test: any = doc;
        return TelemetryObject.createTelemetryObject(test.data);
    })
    .catch((error) => {console.log(error); });
    }
  }
}
