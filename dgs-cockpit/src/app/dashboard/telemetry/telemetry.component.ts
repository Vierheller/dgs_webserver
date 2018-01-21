import { Component, OnInit } from '@angular/core';
import { TelemetryService } from '../../services/telemetry.service';
import {TelemetryObject} from "../../models/objects/TelemetryObject";

@Component({
  selector: 'app-telemetry',
  templateUrl: './telemetry.component.html',
  styleUrls: ['./telemetry.component.css']
})

export class TelemetryComponent implements OnInit {
  collapseState: string;
  collapseText: string;
  lastTelemetry: TelemetryObject;
  lastTelemetryConverted = new Array<TelemetryElement>();

  constructor(private telemetrieService: TelemetryService) { }

  ngOnInit() {
    this.lastTelemetry = new TelemetryObject();
    this.collapseText = 'Parameter einblenden';

    this.telemetrieService.getData().subscribe((data) => {
      this.telemetrieService.getTelemetryById(data[data.length - 1])
          .then((tele) => {
            this.lastTelemetry = <TelemetryObject> tele;
            this.convertTelemetryToElement();
          });
    });
  }

  // convert telemetry data to key-value pairs for UI
  convertTelemetryToElement() {
    this.lastTelemetryConverted = [];

    for (const p in this.lastTelemetry) {
      if (this.lastTelemetry.hasOwnProperty(p) ) {
         this.lastTelemetryConverted.push({parameter: p, value: this.lastTelemetry[p]});
      }
    }
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

export interface TelemetryElement {
  value: string;
  parameter: string;
}
