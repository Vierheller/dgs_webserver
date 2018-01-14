import { Injectable } from '@angular/core';
import { DatabaseConnectorService } from './database-connector/database-connector.service';
import { Subject } from 'rxjs/Subject';
import { Image } from '../models/Image';
import { Promise } from 'q';

/*
Design Document (erforderlich um die Query zu ermöglichen!!)
{
  "_id": "_design/image",
  "views": {
    "allDocuments": {
      "map": "function(doc){ if (doc.data.type === 'image'){ emit(doc._id, doc._rev, doc.data.timestamp)}}"
    }
  }
}

*/


@Injectable()
export class ImageService {
  dataSubject: any = new Subject();

  constructor(public dataService: DatabaseConnectorService) {
      // Hat sich die lokale DB geändert? (Das wird durch eine Änderung der CouchDB initiiert)
      console.log('ImageService constructor');
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
    this.dataService.localDb.query('image/allDocuments/')
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

  getImageById(id: string): Promise<Image> {
    return this.dataService.localDb.get(id)
      .then(function (doc) {
        return <Image>doc.data;
    })
    .catch((error) => {console.log(error); });
  }
}
