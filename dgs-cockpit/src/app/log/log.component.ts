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

  constructor(public logService: LogService) {
    this.logList = [];
  }

  ngOnInit() {
    this.logService.getLogsObservable().subscribe((lines) => {
      this.logList = lines;
    });
  }

}
