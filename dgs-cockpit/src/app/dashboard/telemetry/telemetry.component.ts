import { Component, OnInit } from '@angular/core';
import { TelemetryService } from '../../services/telemetry.service';
import {TelemetryElement, TelemetryObject} from "../../models/objects/TelemetryObject";

@Component({
  selector: 'app-telemetry',
  templateUrl: './telemetry.component.html',
  styleUrls: ['./telemetry.component.css']
})

export class TelemetryComponent implements OnInit {
  collapseState: string;
  collapseText: string;
  lastTelemetry: TelemetryObject;
  lastTelemetryOutput = new Array<TelemetryElement>();

  constructor(private telemetrieService: TelemetryService) { }

  ngOnInit() {
    this.lastTelemetry = new TelemetryObject();
    this.collapseText = 'Parameter einblenden';

    this.telemetrieService.getData().subscribe((data) => {
      this.telemetrieService.getTelemetryById(data[data.length - 1])
          .then((tele) => {
            this.lastTelemetry = tele;
            this.generateTelemetryToOutput();
          });
    });
  }

  // build list for UI
  generateTelemetryToOutput() {
    this.lastTelemetryOutput = [
      this.lastTelemetry.getClass(),
      this.lastTelemetry.getIndex(),
      this.lastTelemetry.getChannel(),
      this.lastTelemetry.getPayload(),
      this.lastTelemetry.getPackageCounter(),
      this.lastTelemetry.getTime(),
      this.lastTelemetry.getLat(),
      this.lastTelemetry.getLon(),
      this.lastTelemetry.getAlt(),
      this.lastTelemetry.getSpeed(),
      this.lastTelemetry.getDirection(),
      this.lastTelemetry.getSatellites(),
      this.lastTelemetry.getTempChip(),
      this.lastTelemetry.getBatteryVoltage(),
      this.lastTelemetry.getCurrentVoltage(),
      this.lastTelemetry.getTempCase(),
      this.lastTelemetry.getPressure(),
      this.lastTelemetry.getHumidity(),
      this.lastTelemetry.getTempExtern(),
      this.lastTelemetry.getTimestamp(),
      this.lastTelemetry.getType(),
    ];
  }

  showOrHideTelemetry() {
    if(this.collapseState == 'show') {
      this.collapseState = '';
      this.collapseText = 'Parameter einblenden';
    } else {
      this.collapseState = 'show';
      this.collapseText = 'Parameter ausblenden';
    }
  }
}

