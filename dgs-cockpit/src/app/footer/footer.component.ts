import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {TelemetryService} from "../services/telemetry.service";
import {TelemetryObject} from "../models/objects/TelemetryObject";

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  lastTel: TelemetryObject;

  constructor(private ref: ChangeDetectorRef, private telemetryService: TelemetryService) {
  }

  ngOnInit() {
    this.telemetryService.getTelemetryForCurrentId().subscribe((telemetry) => {
      this.lastTel = telemetry;
      this.ref.detectChanges();
    });
  }
}
