import {EventEmitter, Injectable} from '@angular/core';
import { DatabaseConnectorService } from './database-connector/database-connector.service';
import { Subject } from 'rxjs/Subject';
import { TelemetryInternal } from '../models/Telemetry';
// import { Promise } from 'q';
import {TelemetryObject} from '../models/objects/TelemetryObject';
import { TelemetryComponent } from '../dashboard/telemetry/telemetry.component';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import 'rxjs/add/operator/mergeMap';
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
  telemetryIDsSubject: Subject<Array<String>> = new Subject();
  private telemetriesObservable: Observable<Array<TelemetryObject>>;
  public telemetryList: Array<TelemetryObject>;
  timelineEvent: EventEmitter<number> = new EventEmitter();

  constructor(public dataService: DatabaseConnectorService) {
      this.telemetryList = [];
      this.telemetriesObservable = this.telemetryIDsSubject.flatMap((ids) => {
        return Observable.create(subscriber => {
          const promises: Array<Promise<any>> = [];
          for (const id of ids) {
            promises.push(this.dataService.localDb.get(id));
          }
          Promise.all(promises).then(function (docs) {
            return docs.map(doc => new TelemetryObject(doc.data) );
          })
          .then(tmtries => subscriber.next(tmtries) )
          .catch((error) => { console.log(error); });
        });
      });

      this.dataService.localDb.changes({live: true, since: 'now', include_docs: true}).on('change', (change) => {
          console.log('ONCHANGE ' + JSON.stringify(change));
          this.loadData();
      });
      this.loadData();
  }

  // Kann von aussen aufgerufen werden
  public getTelemetryObservable(): Observable<Array<TelemetryObject>> {
    return this.telemetriesObservable;
  }

  private loadData() {
    this.dataService.localDb.query('telemetry/allDocuments/')
    .then((data) => {
      const dataset = data.rows.map(row => {
        return row.id;
      });
      this.telemetryIDsSubject.next(dataset);
    })
    .catch((error) => {
      console.log(error);
    });
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
