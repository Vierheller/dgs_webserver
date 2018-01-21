import { Component, OnInit } from '@angular/core';
import {TelemetryService} from "../../services/telemetry.service";
import {TelemetryElement, TelemetryObject} from "../../models/objects/TelemetryObject";

@Component({
  selector: 'app-picture',
  templateUrl: './picture.component.html',
  styleUrls: ['./picture.component.css']
})
export class PictureComponent implements OnInit {

  lastTelemetry: TelemetryObject;
  smallTelemetryOutput = new Array<TelemetryElement>();

  constructor(private telemetrieService: TelemetryService) {
    this.lastTelemetry = new TelemetryObject();
  }

  ngOnInit() {
    this.telemetrieService.getData().subscribe((data) => {
      this.telemetrieService.getTelemetryById(data[data.length - 1])
        .then((tele) => {
          this.lastTelemetry = tele;
          this.generateOutputRows();
        });
    });
  }

  generateOutputRows() {
    this.smallTelemetryOutput = [
      this.lastTelemetry.getSpeed(),
      this.lastTelemetry.getDirection(),
      this.lastTelemetry.getPressure(),
    ];
  }
}
