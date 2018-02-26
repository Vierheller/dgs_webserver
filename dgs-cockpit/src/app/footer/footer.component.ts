import { Component, OnInit } from '@angular/core';
import {TelemetryService} from "../services/telemetry.service";
import {TelemetryObject} from "../models/objects/TelemetryObject";

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  lastTel: TelemetryObject;

  constructor(private telemetryService: TelemetryService) {
  }

  ngOnInit() {
    this.telemetryService.getTelemetryObservable().subscribe((teleObjects) => {
      this.lastTel = teleObjects[teleObjects.length - 1];
    });
  }
}
