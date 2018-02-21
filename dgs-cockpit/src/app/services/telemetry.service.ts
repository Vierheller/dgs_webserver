import {EventEmitter, Injectable} from '@angular/core';
import { DatabaseConnectorService } from './database-connector/database-connector.service';
import {TelemetryObject} from '../models/objects/TelemetryObject';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/shareReplay';
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
  private telemetryIDsObservable: Observable<Array<String>>;
  private telemetriesObservable: Observable<Array<TelemetryObject>>;
  public timelineEvent: EventEmitter<number>;

  constructor(public dataService: DatabaseConnectorService) {
    this.timelineEvent = new EventEmitter<number>();

    this.telemetryIDsObservable = this.reloadSubject.flatMap(_ => {
      return Observable.create(subscriber => {
        this.dataService.localDb.query('telemetry/allDocuments/')
        .then((data) => {
          const dataset = data.rows.map(row => {
            return row.id;
          });
          subscriber.next(dataset);
          subscriber.complete();
        })
        .catch((error) => {
          console.log(error);
        });
      });
    }).shareReplay() as Observable<Array<String>>;

    this.telemetriesObservable = this.telemetryIDsObservable.flatMap((ids) => {
      return Observable.create(subscriber => {
        const promises: Array<Promise<any>> = [];
        for (const id of ids) {
          promises.push(this.dataService.localDb.get(id));
        }
        Promise.all(promises).then(function (docs) {
          return docs.map(doc => new TelemetryObject(doc.data) );
        })
        .then(tmtries => { subscriber.next(tmtries); subscriber.complete(); } )
        .catch((error) => { console.log(error); });
      });
    }).shareReplay() as Observable<Array<TelemetryObject>>;

    this.dataService.localDb.changes({live: true, since: 'now', include_docs: true}).on('change', (change) => {
        this.reloadSubject.next(void 0);
    });
  }

  // Kann von aussen aufgerufen werden
  public getTelemetryObservable(): Observable<Array<TelemetryObject>> {
    return this.telemetriesObservable.do(_ => console.log('Observer to tel obs'));
  }

  getTelemetryById(id: string): Promise<TelemetryObject> {
    if (id) {
    return this.dataService.localDb.get(id)
      .then(function (doc) {
        return new TelemetryObject(doc.data);
    })
    .catch((error) => {console.log(error); });
    }
  }
}
