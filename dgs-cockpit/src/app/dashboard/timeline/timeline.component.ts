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
  playMode: boolean;
  telemetryList: Array<TelemetryObject>;
  selectedTelemetry: TelemetryObject;

  constructor(private telemetryService: TelemetryService) {
    this.playMode = false;
  }

  ngOnInit() {
    this.selectedTelemetry = new TelemetryObject();

    this.telemetryService.getTelemetryObservable().subscribe((teleObjects) => {
      this.telemetryList = teleObjects;

      if(!this.timelineValue || this.timelineValue == this.timelineMax) { // auto update list
        this.timelineValue = teleObjects.length;
        this.selectedTelemetry = this.telemetryList[this.timelineValue - 1];
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

  playTrackedData() {
    this.playMode = !this.playMode;   // toggle button

    /*for(let i=0; i<this.telemetryList.length; i++) {
      setTimeout(function () {
        this.timelineValue = i;
        this.telemetryService.timelineEvent.emit(i);
        this.selectedTelemetry = this.telemetryList[i];
      },2000)
    }*/
  }
}
