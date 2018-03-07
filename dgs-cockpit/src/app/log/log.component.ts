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

  page = 1;
  private countPerPage = 20;

  constructor(public logService: LogService) {
    this.logList = [];
  }

  ngOnInit() {
    this.loadLogs();
  }

  loadLogs() {
    this.logService.getLogsObservable(this.page, this.countPerPage).subscribe((lines) => {
      this.logList = lines;
    });
  }

  nextPage() {
    this.page++;
    this.loadLogs();
  }

  prevPage() {
    if (this.page > 1) {
      this.page--;
      this.loadLogs();
    }
  }

}
