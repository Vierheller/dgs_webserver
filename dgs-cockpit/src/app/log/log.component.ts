import { Component, OnInit } from '@angular/core';
import { LogService } from '../services/log.service';
import { Log } from '../models/Log';

@Component({
  selector: 'app-log',
  templateUrl: './log.component.html',
  styleUrls: ['./log.component.css']
})
export class LogComponent implements OnInit {
  public logList: Log[];

  constructor(public logSvc: LogService) {
    this.logList = new Array<Log>();
  }

  ngOnInit() {
    this.logSvc.getData().subscribe((data) => {
      console.log('COMPONENT DATA: ' + data[0]);
      for (let index = 0; index < data.length; index++) {

        this.logSvc.getLogById(data[index])
          .then((line) => {
            this.logList.push(line);
          });
      }
    });
  }

}
