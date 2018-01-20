import { Component, OnInit } from '@angular/core';
import { TelemetryService } from '../../services/telemetry.service';
import { TelemetryInternal } from '../../models/Telemetry';

@Component({
  selector: 'app-telemetry',
  templateUrl: './telemetry.component.html',
  styleUrls: ['./telemetry.component.css']
})

export class TelemetryComponent implements OnInit {
  collapseState: string;
  collapseText: string;
  lastTelemetry: TelemetryInternal;
  lastTelemetryConverted = new Array<TelemetryElement>();

  constructor(private telemetrieService: TelemetryService) { }

  ngOnInit() {
    this.collapseText = 'Parameter einblenden';

    this.telemetrieService.getData().subscribe((data) => {
      this.telemetrieService.getTelemetryById(data[data.length - 1])
          .then((tele) => {
            console.log(tele);
            this.lastTelemetry = tele;
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

    console.log(this.lastTelemetryConverted);
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
