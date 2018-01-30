import { Injectable } from '@angular/core';
import { DatabaseConnectorService } from './database-connector/database-connector.service';
import { Subject } from 'rxjs/Subject';
import { TelemetryInternal } from '../models/Telemetry';
import { Promise } from 'q';
import {TelemetryObject} from "../models/objects/TelemetryObject";

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
  selectedIndex: number;

  constructor(public dataService: DatabaseConnectorService) {
      // Hat sich die lokale DB geändert? (Das wird durch eine Änderung der CouchDB initiiert)
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

  getSelectedIndex():number {     // for timeline selection
    return this.selectedIndex;
  }

  setSelectedIndex(selection: number) {   // for timeline selection
    this.selectedIndex = selection;
  }
}
