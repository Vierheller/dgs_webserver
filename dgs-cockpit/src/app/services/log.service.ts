import { Injectable } from '@angular/core';
import { DatabaseConnectorService } from './database-connector/database-connector.service';
import { Subject } from 'rxjs/Subject';
import { Log } from '../models/Log';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import { Promise } from 'bluebird';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import index from '@angular/cli/lib/cli';


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
  // private logIDsSubject: BehaviorSubject<void> = new BehaviorSubject(void 0);
  // private logsObservable: Observable<Array<Log>>;

  constructor(public dataService: DatabaseConnectorService) {
      // Hat sich die lokale DB geändert? (Das wird durch eine Änderung der CouchDB initiiert)
      this.logIDsObservable = this.reloadSubject.switchMap(_ => {
      return Observable.create(subscriber => {
        this.dataService.localDb.query('log/allDocuments/')
          .then((data) => {
            console.log('Got new ids');
            const dataset = data.rows.map(row => {
              return row.id;
            }).reverse();

            subscriber.next(dataset);
          })
          .catch((error) => {
            console.log(error);
          });
      });
    }).shareReplay() as Observable<Array<string>>;

    // this.logsObservable = this.logIDsObservable.switchMap((ids) => {
    //   return Observable.create(subscriber => {
    //     const promises: Array<Promise<any>> = [];
    //     for (const id of ids) {
    //       promises.push(this.dataService.localDb.get(id));
    //     }
    //     Promise.all(promises).then(function (docs) {
    //       return docs.map(doc => <Log>doc.data); // TelemetryObject.createTelemetryObject(doc.data));
    //     })
    //       .then(tmtries => { subscriber.next(tmtries); subscriber.complete(); } )
    //       .catch((error) => { console.log(error); });
    //   });
    // }).shareReplay() as Observable<Array<Log>>;

      this.dataService.localDb.changes({live: true, since: 'now', include_docs: true, view: 'log/allDocuments/'})
        .on('change', (change) => {
          /*if (change.doc && change.doc.data && change.doc.data.type === 'log') {
            this.reloadSubject.next(void 0);
          }*/
          this.reloadSubject.next(void 0);
      });
      // this.loadData();
  }



  // Kann von aussen aufgerufen werden
  public getLogsObservable(page: number, rowsPerPage: number): Observable<Array<Log>> {
    const skip = (page - 1) * rowsPerPage;
    const limit = page * rowsPerPage;
    console.log('Requesting new data for skip: ' + skip + ' limit: ' + limit);
    return this.getObservable(skip, limit);
  }

  getObservable(skip: number, limit: number): Observable<Array<Log>> {
    return this.logIDsObservable.switchMap((ids: Array<string>) => {
      return Observable.create(subscriber => {
        const promises: Array<Promise<any>> = [];

        ids = ids.slice(skip, limit);

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
        const test: any = doc;
        return <Log>test.data;
    })
    .catch((error) => {console.log(error); });
  }
}
