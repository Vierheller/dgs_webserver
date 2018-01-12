import { Injectable } from '@angular/core';
import { DatabaseConnectorService } from './database-connector/database-connector.service';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class TelemetryService {
  dataSubject: any = new Subject();

  constructor(public dataService: DatabaseConnectorService) {
      // Hat sich die lokale DB geändert? (Das wird durch eine Änderung der CouchDB initiiert)
      this.dataService.db.changes({live: true, since: 'now', include_docs: true}).on('change', (change) => {
          this.emitData();
      });
  }

  // Kann von aussen aufgerufen werden
  getData() {
    this.emitData();
    return this.dataSubject;
  }

  emitData(): void {
    this.dataService.db.query('dgs').then((data) => {
        const dataset = data.rows.map(row => {
          console.log(row);
          return row.value;
        });
      this.dataSubject.next(dataset);
    });
  }
}
