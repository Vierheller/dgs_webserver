import { Component, OnInit } from '@angular/core';
import { TelemetryService } from '../../services/telemetry.service';
import {TelemetryElement, TelemetryObject} from '../../models/objects/TelemetryObject';
import {Promise} from 'q';

@Component({
  selector: 'app-telemetry',
  templateUrl: './telemetry.component.html',
  styleUrls: ['./telemetry.component.css']
})

export class TelemetryComponent implements OnInit {
  collapseState: string;
  collapseText: string;
  currentTelemetry: TelemetryObject;
  telemetryList: Promise<TelemetryObject>;
  lastTelemetryOutput = new Array<TelemetryElement>();

  constructor(private telemetryService: TelemetryService) { }

  ngOnInit() {
    this.currentTelemetry = new TelemetryObject();
    this.collapseText = 'Parameter einblenden';

    this.telemetryService.getTelemetryObservable().subscribe((teleObjects) => {
      this.currentTelemetry = teleObjects[teleObjects.length - 1];
      this.generateTelemetryToOutput();
    });
    // when custom time has been selected
    // ToDo für Gabriel: telemetryList ist kein Array, schau mal wie du das lösen willst
    /*this.telemetryService.timelineEvent.subscribe((index) => {
      if (this.telemetryList) {
        this.telemetryService.getTelemetryById(this.telemetryList[index - 1]).then((tele) => {
          this.currentTelemetry = tele;
          this.generateTelemetryToOutput();
        });
      }
    });*/
  }

  // build list for UI
  generateTelemetryToOutput() {
    if (this.lastTelemetryOutput) {
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

