import { Injectable } from '@angular/core';
import { DatabaseConnectorService } from './database-connector/database-connector.service';
import { Subject } from 'rxjs/Subject';
import { Log } from '../models/Log';
import { Promise } from 'q';

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
  dataSubject: any = new Subject();

  constructor(public dataService: DatabaseConnectorService) {
      // Hat sich die lokale DB geändert? (Das wird durch eine Änderung der CouchDB initiiert)
      console.log('LogService constructor');
      this.dataService.localDb.changes({live: true, since: 'now', include_docs: true}).on('change', (change) => {
          console.log('ONCHANGE ' + JSON.stringify(change));
          this.emitData();
      });
  }
  // Kann von aussen aufgerufen werden
  getData(): any {
    this.emitData();
    return this.dataSubject;
  }

  emitData(): void {
    this.dataService.localDb.query('log/allDocuments/')
      .then((data) => {
        const dataset = data.rows.map(row => {
          return row.id;
        });
      this.dataSubject.next(dataset);
    })
    .catch((error) => {
      console.log(error);
    });
  }

  getLogById(id: string): Promise<Log> {
    return this.dataService.localDb.get(id)
      .then(function (doc) {
        return <Log>doc.data;
    })
    .catch((error) => {console.log(error); });
  }
}