import {EventEmitter, Injectable} from '@angular/core';
import { DatabaseConnectorService } from './database-connector/database-connector.service';
import { Subject } from 'rxjs/Subject';
import { TelemetryInternal } from '../models/Telemetry';
import { Promise } from 'q';
import {TelemetryObject} from '../models/objects/TelemetryObject';

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
  dataSubject: any = new Subject();
  timelineEvent: any = new EventEmitter();
  public telemetryList: Array<TelemetryObject>;

  constructor(public dataService: DatabaseConnectorService) {
      this.telemetryList = [];
      // Hat sich die lokale DB geändert? (Das wird durch eine Änderung der CouchDB initiiert)
      /*this.dataService.localDb.changes({live: true, since: 'now', include_docs: true}).on('change', (change) => {
          console.log('ONCHANGE ' + JSON.stringify(change));
          this.emitData();
      });*/

      dataService.getChangeListener().subscribe(data => {
        for (let i = 0; i < data.change.docs.length; i++) {
          if (data.change.docs[i].data && data.change.docs[i].data.type === 'telemetry') {
            this.telemetryList.push(new TelemetryObject(data.change.docs[i].data));
          }
        }
      });

      dataService.fetch()
        .then(result => {
          this.telemetryList = [];
          for (let i = 0; i < result.rows.length; i++) {
            if (result.rows[i].doc.data && result.rows[i].doc.data.type === 'telemetry') {
              this.telemetryList.push(new TelemetryObject(result.rows[i].doc.data));
              console.log('Current Length: ' + this.telemetryList.length);
            }
          }
        }, error => {
            console.error(error);
      });
  }

  // Kann von aussen aufgerufen werden
  getData(): any {
    this.emitData();
    return this.dataSubject;
  }

  emitData(): void {
    this.dataService.localDb.query('telemetry/allDocuments/')
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

  getTelemetryById(id: string): Promise<TelemetryObject> {
    return this.dataService.localDb.get(id)
      .then(function (doc) {
        return new TelemetryObject(doc.data);
    })
    .catch((error) => {console.log(error); });
  }
}
