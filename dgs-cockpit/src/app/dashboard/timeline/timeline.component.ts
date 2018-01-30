import { Component, OnInit } from '@angular/core';
import {TelemetryService} from "../../services/telemetry.service";
import {TelemetryObject} from "../../models/objects/TelemetryObject";

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.css']
})
export class TimelineComponent implements OnInit {

  timelineValue: number;
  timelineMax: number;
  telemetrieList: any;
  selectedTelemetry: TelemetryObject;

  constructor(private telemetrieService: TelemetryService) {}

  ngOnInit() {
    this.selectedTelemetry = new TelemetryObject();

    this.telemetrieService.getData().subscribe((data) => {    // get telemetry data
      this.telemetrieService.setSelectedIndex(data.length);
      this.telemetrieList = data;

      if(!this.timelineValue || this.timelineValue == this.timelineMax)   // auto update list
        this.timelineValue = data.length;

      this.timelineMax = data.length;

      this.telemetrieService.getTelemetryById(data[this.timelineValue - 1]).then((tele) => {
        this.selectedTelemetry = tele;
      });
    });
  }

  // select telemetry data
  changeTimeSelection(value: number) {
    if(value) {
      this.timelineValue = value;
      this.telemetrieService.setSelectedIndex(this.timelineValue);    // set selection to service

      this.telemetrieService.getTelemetryById(this.telemetrieList[this.timelineValue - 1]).then((tele) => {
        this.selectedTelemetry = tele;
      });
    }
  }
}
