import { Component, OnInit } from '@angular/core';
import { TelemetryService } from '../../services/telemetry.service';
import {TelemetryElement, TelemetryObject} from '../../models/objects/TelemetryObject';
import {Promise} from 'q';
import {TimelineComponent} from "../timeline/timeline.component";

@Component({
  selector: 'app-telemetry',
  templateUrl: './telemetry.component.html',
  styleUrls: ['./telemetry.component.css']
})

export class TelemetryComponent implements OnInit {
  collapseState: string;
  collapseText: string;
  historyMode: boolean;
  currentTelemetry: TelemetryObject;
  telemetryList: Array<TelemetryObject>;
  lastTelemetryOutput = new Array<TelemetryElement>();

  constructor(private telemetryService: TelemetryService) {
    this.collapseText = 'Parameter einblenden';
    this.historyMode = false;
    this.currentTelemetry = new TelemetryObject();
    this.generateTelemetryToOutput();   // set the init values to UI
  }

  ngOnInit() {
    this.telemetryService.getTelemetryObservable().subscribe((teleObjects) => {
      this.telemetryList = teleObjects;

      if(!this.historyMode) {
        this.currentTelemetry = teleObjects[teleObjects.length - 1];
        this.generateTelemetryToOutput();
      }
    });

    // when custom time has been selected by user
    this.telemetryService.timelineEvent.subscribe((index) => {
      if (this.telemetryList) {
        this.currentTelemetry = this.telemetryList[index - 1];
        this.generateTelemetryToOutput();

        this.historyMode = this.telemetryList.length > index;   // disable historyMode if slider is on max
      }
    });
  }

  // build list for UI
  generateTelemetryToOutput() {
    if (this.currentTelemetry) {
      this.lastTelemetryOutput = [
        this.currentTelemetry.getClass(),
        this.currentTelemetry.getIndex(),
        this.currentTelemetry.getChannel(),
        this.currentTelemetry.getPayload(),
        this.currentTelemetry.getPackageCounter(),
        this.currentTelemetry.getTime(),
        this.currentTelemetry.getLat(),
        this.currentTelemetry.getLon(),
        this.currentTelemetry.getAlt(),
        this.currentTelemetry.getSpeed(),
        this.currentTelemetry.getDirection(),
        this.currentTelemetry.getSatellites(),
        this.currentTelemetry.getTempChip(),
        this.currentTelemetry.getBatteryVoltage(),
        this.currentTelemetry.getCurrentVoltage(),
        this.currentTelemetry.getTempCase(),
        this.currentTelemetry.getPressure(),
        this.currentTelemetry.getHumidity(),
        this.currentTelemetry.getTempExtern(),
        this.currentTelemetry.getTimestamp(),
        this.currentTelemetry.getType(),
      ];
    }
  }

  showOrHideTelemetry() {
    if (this.collapseState === 'show') {
      this.collapseState = '';
      this.collapseText = 'Parameter einblenden';
    } else {
      this.collapseState = 'show';
      this.collapseText = 'Parameter ausblenden';
    }
  }
}

