import { Component, OnInit } from '@angular/core';
import { TelemetryService } from '../services/telemetry.service';
import { TelemetryInternal } from '../models/Telemetry';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  telemetryList: TelemetryInternal[];
  constructor(public telSvc: TelemetryService) {
    this.telemetryList = new Array();
  }

  ngOnInit() {
    this.telSvc.getData().subscribe((data) => {
      console.log('COMPONENT DATA: ' + data[0]);
      for (let index = 0; index < data.length; index++) {

        this.telSvc.getTelemetryById(data[index])
          .then((tele) => {
            this.telemetryList.push(tele);
          });
      }
    });
  }
}
