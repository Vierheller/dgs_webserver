import { Injectable } from '@angular/core';
import { DatabaseConnectorService } from './database-connector/database-connector.service';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class TelemetryService {
  dataSubject: any = new Subject();

  constructor(public dataService: DatabaseConnectorService) {
      // Hat sich die lokale DB geändert? (Das wird durch eine Änderung der CouchDB initiiert)
      console.log('TelemetryService constructor');
      this.dataService.db.changes({live: true, since: 'now', include_docs: true}).on('change', (change) => {
          console.log('ONCHANGE ' + change);
          this.emitData();
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
    this.dataService.db.query('/example/_view/foo')
      .then((data) => {
        const dataset = data.rows.map(row => {
          console.log('ROW' + row);
          return row.value;
        });
      this.dataSubject.next(dataset);
    })
    .catch((error) => {
      console.log(error);
    });
  }
}
