import {Component, OnInit} from '@angular/core';
import {TelemetryService} from '../../services/telemetry.service';
import {TelemetryObject} from '../../models/objects/TelemetryObject';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.css']
})
export class TimelineComponent implements OnInit {
  timelineValue: number;
  timelineMax: number;
  playMode: boolean;
  repeatMode: boolean;
  telemetryList: Array<TelemetryObject>;
  selectedTelemetry: TelemetryObject;

  constructor(private telemetryService: TelemetryService) {
    this.playMode = false;
    this.repeatMode = false;
  }

  ngOnInit() {

    this.telemetryService.getTelemetryObservable().subscribe((teleObjects) => {
      this.telemetryList = teleObjects;

      if (!this.timelineValue || this.timelineValue === this.timelineMax) { // auto update list
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
      this.telemetryService.timelineEvent.emit(this.timelineValue - 1);    // trigger timeline event

      if (this.telemetryList) {
        this.selectedTelemetry = this.telemetryList[this.timelineValue - 1];
      }
    }
  }

  startOrStopPlayingTrackedData() {
    if (!this.playMode) {
      if (this.timelineValue === this.timelineMax) {
        this.timelineValue = 1;
      }
      this.playTrackedData();
    }
    this.togglePlayButton();
  }

  // recursive
  playTrackedData() {
    if (this.timelineValue === this.timelineMax) {
      if (this.repeatMode) {
        this.timelineValue = 1;
      } else {
        this.togglePlayButton();
        return;
      }
    }

    this.telemetryService.timelineEvent.emit(this.timelineValue - 1);
    this.selectedTelemetry = this.telemetryList[this.timelineValue - 1];

    setTimeout(() => {
      if (this.playMode) {
        this.timelineValue++;
        this.playTrackedData();   // next step recursive
      }
    }, 2000);
  }

  togglePlayButton() {
    this.playMode = !this.playMode;
  }

  toggleRepeatMode() {
    this.repeatMode = !this.repeatMode;
  }
}
