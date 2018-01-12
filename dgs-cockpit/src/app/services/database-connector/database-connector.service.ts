import { Injectable } from '@angular/core';
import * as PouchDB from 'pouchdb';

@Injectable()
export class DatabaseConnectorService {
  db: any;
  remote: string = 'http://127.0.0.1:5984/dgs';

  constructor() {

      this.db = new PouchDB('dgs');

      const options = {
        live: true,
        retry: true,
        continuous: true
      };

      this.db.sync(this.remote, options);

  }
}
