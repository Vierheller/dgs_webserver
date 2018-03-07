import { Injectable } from '@angular/core';
import { DatabaseConnectorService } from './database-connector/database-connector.service';
import { Subject } from 'rxjs/Subject';
import { Log } from '../models/Log';
import {Observable} from 'rxjs/Observable';
import { Promise } from 'bluebird';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';


/*
Design Document (erforderlich um die Query zu ermöglichen!!)
{
  "_id": "_design/log",
  "views": {
    "allDocuments": {
      "map": "function(doc){ if (doc.data.type === 'log'){ emit(doc._id, doc._rev, doc.data.timestamp)}}"
    }
  }
}

*/


@Injectable()
export class LogService {
  private reloadSubject: BehaviorSubject<void> = new BehaviorSubject(void 0);
  private logIDsObservable: Observable<Array<string>>;
  private logsObservable: Observable<Array<Log>>;

  // private logIDsSubject: BehaviorSubject<void> = new BehaviorSubject(void 0);
  // private logsObservable: Observable<Array<Log>>;

  constructor(public dataService: DatabaseConnectorService) {
      // Hat sich die lokale DB geändert? (Das wird durch eine Änderung der CouchDB initiiert)
      this.logIDsObservable = this.reloadSubject.flatMap(_ => {
        return Observable.create(subscriber => {
          this.dataService.localDb.query('log/allDocuments/')
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
      }).shareReplay() as Observable<Array<string>>;

      this.logsObservable = this.logIDsObservable.flatMap((ids) => {
        return Observable.create(subscriber => {
          const promises: Array<Promise<any>> = [];
          for (const id of ids) {
            promises.push(this.dataService.localDb.get(id));
          }
          Promise.all(promises).then(function (docs) {
            return docs.map(doc => <Log>doc.data); // TelemetryObject.createTelemetryObject(doc.data));
          })
          .then(tmtries => { subscriber.next(tmtries); subscriber.complete(); } )
          .catch((error) => { console.log(error); });
        });
      }).shareReplay() as Observable<Array<Log>>;

      this.dataService.localDb.changes({live: true, since: 'now', include_docs: true, view: 'log/allDocuments/'})
        .on('complete', (change) => {
          /*if (change.doc && change.doc.data && change.doc.data.type === 'log') {
            this.reloadSubject.next(void 0);
          }*/
          this.reloadSubject.next(void 0);
      });
      // this.loadData();
  }

  // Kann von aussen aufgerufen werden
  public getLogsObservable(): Observable<Array<Log>> {
    return this.logsObservable;
  }

  /*private loadData() {
    this.dataService.localDb.query('log/allDocuments/')
      .then((data) => {
        const dataset = data.rows.map(row => {
          return row.id;
        });
        this.logIDsSubject.next(dataset);
      })
      .catch((error) => {
        console.log(error);
      });
  }*/

  public getLogById(id: string): Promise<Log> {
    return this.dataService.localDb.get(id)
      .then(function (doc) {
        return <Log>doc.data;
    })
    .catch((error) => {console.log(error); });
  }
}
