import { Injectable } from '@angular/core';
import PouchDB, { emit } from 'pouchdb';

@Injectable()
export class DatabaseConnectorService {
  public localDb: any;
  private remoteDb: any;
  private remote = 'http://admin:admin@127.0.0.1:5984/dgs';

  constructor() {

      // this.db = new PouchDB('dgs');
      this.localDb = new PouchDB('dgs');
      this.remoteDb = new PouchDB(this.remote);

      this.localDb.sync(this.remoteDb, {
        live: true,
        retry: true,
        continuous: true
      }).on('change', function (change) {
        console.log('DB change oocured.');
      }).on('paused', function (info) {
        console.log('DB Replication paused.');
      }).on('active', function (info) {
        console.log('DB Replication resumed.');
      }).on('error', function (err) {
        console.log('DB Fatal error while replicating!');
      });
      console.log('DB Constructor');
  }
}
