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
  public imageList: Array<Image>;

  constructor(public dataService: DatabaseConnectorService) {
    this.imageList = [];

    dataService.getChangeListener().subscribe(data => {
      for (let i = 0; i < data.change.docs.length; i++) {
        if (data.change.docs[i].data && data.change.docs[i].data.type === 'image') {
          this.imageList.push(data.change.docs[i].data);
        }
      }
    });

    dataService.fetch()
      .then(result => {
        this.imageList = [];
        for (let i = 0; i < result.rows.length; i++) {
          if (result.rows[i].doc.data && result.rows[i].doc.data.type === 'image') {
            this.imageList.push(result.rows[i].doc.data);
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
