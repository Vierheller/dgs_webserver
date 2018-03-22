import {ChangeDetectorRef, OnDestroy, Component, OnInit} from '@angular/core';
import {TelemetryService} from '../services/telemetry.service';
import {TelemetryObject} from '../models/objects/TelemetryObject';
import {Subscription} from 'rxjs/Subscription';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})

export class FooterComponent implements OnInit, OnDestroy {
  private telemetrySubscription: Subscription;

  lastTel: TelemetryObject;

  constructor(private ref: ChangeDetectorRef, private telemetryService: TelemetryService) {
  }

  ngOnInit() {
    this.telemetrySubscription = this.telemetryService.getTelemetryForCurrentId().subscribe((telemetry) => {
      this.lastTel = telemetry;
      this.ref.detectChanges();
    });
  }

  ngOnDestroy() {
    this.telemetrySubscription.unsubscribe();
  }
}
