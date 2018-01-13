import { Injectable } from '@angular/core';
import PouchDB from 'pouchdb';

@Injectable()
export class DatabaseConnectorService {
  db: any;
  remote = 'http://admin:admin@192.168.0.108:5984/dgs';

  constructor() {

      this.db = new PouchDB('dgs');
      console.log('DB Constructor');
      this.syncDB();

  }

  // Initialise a sync with the remote server
  syncDB() {
    console.log('Enable Syncing');
    const opts = {
      live: true,
      retry: true,
      continuous: true
    };
    this.db.replicate.to(this.remote, opts, this.syncError);
    this.db.replicate.from(this.remote, opts, this.syncError);
  }

  // EDITING STARTS HERE (you dont need to edit anything below this line)

  // There was some form or error syncing
  syncError() {
    console.log('ERROR SYNCING DB');
  }
}
