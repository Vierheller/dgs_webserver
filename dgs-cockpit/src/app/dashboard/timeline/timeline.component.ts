import { Component, OnInit } from '@angular/core';
import {TelemetryService} from "../../services/telemetry.service";
import {TelemetryObject} from "../../models/objects/TelemetryObject";
import {Promise} from "q";

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.css']
})
export class TimelineComponent implements OnInit {

  timelineValue: number;
  timelineMax: number;
  telemetryList: Promise<TelemetryObject>;
  selectedTelemetry: TelemetryObject;

  constructor(private telemetryService: TelemetryService) {}

  ngOnInit() {
    this.selectedTelemetry = new TelemetryObject();

    this.telemetryService.getData().subscribe((data) => {    // get telemetry data
      this.telemetryService.timelineEvent.emit(data.length);
      this.telemetryList = data;

      if(!this.timelineValue || this.timelineValue == this.timelineMax)   // auto update list
        this.timelineValue = data.length;

      this.timelineMax = data.length;
    });
  }

  // select telemetry data
  changeTimeSelection(value: number) {
    if(value) {
      this.timelineValue = value;
      this.telemetryService.timelineEvent.emit(this.timelineValue);    // trigger timeline event

      if(this.telemetryList) {
        this.telemetryService.getTelemetryById(this.telemetryList[this.timelineValue - 1]).then((tele) => {
          this.selectedTelemetry = tele;
        });
      }
    }
  }
}
