import { Component, OnInit } from '@angular/core';
import { TelemetryService } from '../services/telemetry.service';
import { TelemetryInternal } from '../models/Telemetry';
import { TelemetryObject } from '../models/objects/TelemetryObject';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  constructor(public telemetryService: TelemetryService) {

  }
}
