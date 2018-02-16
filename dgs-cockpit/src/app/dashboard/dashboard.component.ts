import { Component, OnInit } from '@angular/core';
import { TelemetryService } from '../services/telemetry.service';
import { TelemetryInternal } from '../models/Telemetry';
import { TelemetryObject } from '../models/objects/TelemetryObject';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  currentTelemetry: TelemetryObject;
  constructor(public telemetryService: TelemetryService) {
    this.currentTelemetry = new TelemetryObject();
  }

  ngOnInit() {
    this.telemetryService.getTelemetryObservable().subscribe((teleObjects) => {
      this.currentTelemetry = teleObjects[teleObjects.length - 1];
    });
  }
}
