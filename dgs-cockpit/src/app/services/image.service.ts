import { Injectable } from '@angular/core';
import { DatabaseConnectorService } from './database-connector/database-connector.service';
import { ImageObject } from '../models/objects/ImageObject';
import { Promise } from 'bluebird';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Observable} from 'rxjs/Observable';

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
  private reloadSubject: BehaviorSubject<void> = new BehaviorSubject(void 0);
  private imageIDsObservable: Observable<Array<string>>;
  private imagesObservable: Observable<Array<ImageObject>>;

  constructor(public dataService: DatabaseConnectorService) {
    this.imageIDsObservable = this.reloadSubject.flatMap(_ => {
      return Observable.create(subscriber => {
        this.dataService.localDb.query('image/allDocuments/')
          .then((data) => {
            const dataset = data.rows.map(row => {
              return row.id;
            });
            subscriber.next(dataset);
            subscriber.complete();
          })
          .catch((error) => {
            console.log(error);
          });
      });
    }).shareReplay() as Observable<Array<string>>;

    this.imagesObservable = this.imageIDsObservable.flatMap((ids) => {
      return Observable.create(subscriber => {
        const promises: Array<Promise<any>> = [];
        for (const id of ids) {
          promises.push(this.dataService.localDb.get(id));
        }
        Promise.all(promises).then(function (docs) {
          return docs.map(doc => new ImageObject(doc.data) );
        })
          .then(tmtries => { subscriber.next(tmtries); subscriber.complete(); } )
          .catch((error) => { console.log(error); });
      });
    }).shareReplay() as Observable<Array<ImageObject>>;

    this.dataService.localDb.changes({live: true, since: 'now', include_docs: true, view: 'image/allDocuments/'})
      .on('complete', (change) => {
      // if (change.doc && change.doc.data && change.doc.data.type === 'image') {
        this.reloadSubject.next(void 0);
      // }
    });
  }

  // Kann von aussen aufgerufen werden
  public getImageObservable(): Observable<Array<ImageObject>> {
    return this.imagesObservable.do(_ => console.log('Observer to img obs'));
  }

  getImageById(id: string): Promise<ImageObject> {
    if (id) {
      return this.dataService.localDb.get(id)
        .then(function (doc) {
          return new Image(doc.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }
}
