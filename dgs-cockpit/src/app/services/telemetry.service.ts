import { Injectable } from '@angular/core';
import { DatabaseConnectorService } from './database-connector/database-connector.service';
import { Subject } from 'rxjs/Subject';
import { TelemetryInternal } from '../models/Telemetry';
import { Promise } from 'q';

@Injectable()
export class TelemetryService {
  dataSubject: any = new Subject();

  constructor(public dataService: DatabaseConnectorService) {
      // Hat sich die lokale DB geändert? (Das wird durch eine Änderung der CouchDB initiiert)
      console.log('TelemetryService constructor');
      this.dataService.localDb.changes({live: true, since: 'now', include_docs: true}).on('change', (change) => {
          console.log('ONCHANGE ' + JSON.stringify(change));
          this.emitData();
      });

      this.dataService.localDb.info().then(function (info) {
        console.log(info);
      });
  }
  // Kann von aussen aufgerufen werden
  getData(): any {
    console.log('TelemetryService getData()');
    this.emitData();
    return this.dataSubject;
  }

  emitData(): void {
    // Sollte hier sein http://127.0.0.1:5984/dgs/_design/example/_view/foo
    this.dataService.localDb.query('telemetry/allDocuments/')
      .then((data) => {
        const dataset = data.rows.map(row => {
          console.log('ROW' + row.id);
          return row.id;
        });
      this.dataSubject.next(dataset);
    })
    .catch((error) => {
      console.log(error);
    });
  }

  getTelemetryById(id: string): Promise<TelemetryInternal> {
    return this.dataService.localDb.get(id)
      .then(function (doc) {
        return <TelemetryInternal>doc.data;
    })
    .catch((error) => {console.log(error); });
  }
}
