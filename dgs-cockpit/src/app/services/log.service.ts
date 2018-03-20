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
  dataService: DatabaseConnectorService;


  constructor(dataService: DatabaseConnectorService) {
    this.dataService = dataService;
    // Hat sich die lokale DB geändert? (Das wird durch eine Änderung der CouchDB initiiert)
    this.logIDsObservable = this.reloadSubject.switchMap(_ => {
      return Observable.create(subscriber => {
        this.dataService.localDb.query('log/allDocuments/')
          .then((data) => {
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

    this.dataService.localDb.changes({live: true, since: 'now', include_docs: true})
      .on('change', (change) => {
        const data: any = change.doc;
        if (data && data.data && data.data.type === 'log') {
          this.reloadSubject.next(void 0);
        }
    });
  }

  getLogs(pageSub: BehaviorSubject<number>, countPerPageSub: BehaviorSubject<number>) {
    return Observable.combineLatest(pageSub, countPerPageSub, this.logIDsObservable)
      .flatMap(latest => {
        const [page, countPerPage, idss] = latest;
        const skip = (page - 1) * countPerPage;
        const limit = page * countPerPage;
        console.log(page + ' ' + skip + ' ' + limit);

        return Observable.create(subscriber => {
          const promises: Array<Promise<any>> = [];
          console.log(skip + ' ' + limit);
          const ids = idss.slice(skip, limit);

          for (const id of ids) {
            promises.push(this.dataService.localDb.get(id));
          }
          Promise.all(promises).then(function (docs) {
            return docs.map(doc => <Log>doc.data); // TelemetryObject.createTelemetryObject(doc.data));
          })
            .then(logs => {
              subscriber.next(logs);
              subscriber.complete();
            })
            .catch((error) => {
              console.log(error);
            });
        });
      });
  }

  public getLogById(id: string): Promise<Log> {
    return this.dataService.localDb.get(id)
      .then(function (doc) {
        const test: any = doc;
        return <Log>test.data;
    })
    .catch((error) => {console.log(error); });
  }
}
