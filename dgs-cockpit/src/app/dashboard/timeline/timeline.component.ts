import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {TelemetryService} from '../../services/telemetry.service';
import {TelemetryObject} from '../../models/objects/TelemetryObject';
import {Promise} from 'q';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.css']
})
export class TimelineComponent implements OnInit {

  timelineValue: number;
  timelineMax: number;
  telemetryList: Array<TelemetryObject>;
  selectedTelemetry: TelemetryObject;

  constructor(private telemetryService: TelemetryService) {}

  ngOnInit() {
    this.selectedTelemetry = new TelemetryObject();

    this.telemetryService.getTelemetryObservable().subscribe((teleObjects) => {
      this.telemetryList = teleObjects;

      if(!this.timelineValue || this.timelineValue == this.timelineMax) { // auto update list
        this.timelineValue = teleObjects.length;
      }

      this.timelineMax = teleObjects.length;
    });
  }

  // select telemetry data
  changeTimeSelection(value: number) {
    if (value) {
      this.timelineValue = value;
      this.telemetryService.timelineEvent.emit(this.timelineValue);    // trigger timeline event

      if (this.telemetryList) {
        this.selectedTelemetry = this.telemetryList[this.timelineValue - 1];
      }
    }
  }
}
