import { Injectable } from '@angular/core';
import PouchDB, { emit } from 'pouchdb';
import PouchFind from 'pouchdb-find';
PouchDB.plugin(PouchFind);

@Injectable()
export class DatabaseConnectorService {
  public localDb: any;
  private remoteDb: any;
  private remote = 'http://admin:admin@127.0.0.1:5984/dgs';
  private isInstantiated: boolean;

  constructor() {
    if (!this.isInstantiated) {
      // this.db = new PouchDB('dgs');
      this.localDb = new PouchDB('dgs');
      this.remoteDb = new PouchDB(this.remote);
      this.isInstantiated = true;
    }

    this.localDb.sync(this.remoteDb, {
      live: true,
      retry: true,
      continuous: true
    }).on('change', function (change) {
      console.log('DB change oocured.');
      this.listener.emit(change);
    }).on('paused', function (info) {
      console.log('DB Replication paused.');
    }).on('active', function (info) {
      console.log('DB Replication resumed.');
    }).on('error', function (err) {
      console.log('DB Fatal error while replicating!');
    });
    console.log('DB Constructor');

    this.localDb.createIndex({
      index: {
        fields: ['data.timestamp', 'data.type']
      }
    }).then(function (result) {
      console.log(result);
    }).catch(function (err) {
      console.log(err);
    });
  }

  public fetch() {
    return this.localDb.allDocs({include_docs: true});
}
}
