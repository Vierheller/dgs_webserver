import {Component, OnInit, ChangeDetectorRef, OnDestroy} from '@angular/core';
import { TelemetryService } from '../../services/telemetry.service';
import {TelemetryElement, TelemetryObject} from '../../models/objects/TelemetryObject';
import {Subscription} from "rxjs/Subscription";

@Component({
  selector: 'app-telemetry',
  templateUrl: './telemetry.component.html',
  styleUrls: ['./telemetry.component.css']
})

export class TelemetryComponent implements OnInit, OnDestroy {
  private telemetrySubscription: Subscription;

  collapseState: string;
  collapseText: string;
  manualSlidingMode: boolean;
  telemetryObject: TelemetryObject;
  outputWeather: Array<TelemetryElement>;
  outputMovement: Array<TelemetryElement>;
  outputOthers: Array<TelemetryElement>;

  constructor(private ref: ChangeDetectorRef, private telemetryService: TelemetryService) {
    this.collapseText = 'Parameter einblenden';
    this.manualSlidingMode = false;
    this.outputWeather = new Array<TelemetryElement>();
    this.outputMovement = new Array<TelemetryElement>();
    this.outputOthers = new Array<TelemetryElement>();
    this.generateTelemetryToOutput();   // set the init values to UI
  }

  ngOnInit() {
    this.telemetrySubscription = this.telemetryService.getTelemetryForCurrentId().subscribe((telemetry) => {
      this.telemetryObject = telemetry;
      this.generateTelemetryToOutput();
      this.ref.detectChanges();
    });
  }

  ngOnDestroy() {
    this.telemetrySubscription.unsubscribe();
  }

  // build list for UI
  generateTelemetryToOutput() {
      if (!this.telemetryObject) {
        return;
      }

      this.outputWeather = [
        this.telemetryObject.getPressure(),
        // currentTelemetry.getHumidity(),
        this.telemetryObject.getWindDirection(),
        this.telemetryObject.getTempExtern(),
        this.telemetryObject.getTempCase(),
        this.telemetryObject.getTempChip(),
      ];

      // add rise rate
      // TODO
      /*if (this.currTelePtr > 0) {
        this.outputMovement.push(currentTelemetry.getRiseRate(
          this.telemetryList[this.currTelePtr - 1].getAlt().value,
          this.telemetryList[this.currTelePtr - 1].getTime().value
        ));
      } else {
        this.outputMovement.push(currentTelemetry.getRiseRate(
          currentTelemetry.getAlt().value,
          currentTelemetry.getTime().value
        ));
      }*/

      this.outputMovement = [
        this.telemetryObject.getDMS(),
        // currentTelemetry.getLat(),
        // currentTelemetry.getLon(),
        this.telemetryObject.getAlt(),
        this.telemetryObject.getSpeed(),
        this.telemetryObject.getDirectionCombined(),
        // TODO: this.telemetryObject.getDistance(this.telemetryList[0].getLat().value, this.telemetryList[0].getLon().value),
        // currentTelemetry.getCDA(),
        // currentTelemetry.getPredictedLatitude(),
        // currentTelemetry.getPredictedLongitude(),
        this.telemetryObject.getPredictedDMS(),
        this.telemetryObject.getPredictedLandingSpeed(),
        this.telemetryObject.getPredictedTimeToLanding()
      ];

      this.outputOthers = [
        this.telemetryObject.getClass(),
        // currentTelemetry.getIndex(),
        this.telemetryObject.getSatellites(),
        this.telemetryObject.getChannel(),
        // currentTelemetry.getPayload(),
        this.telemetryObject.getPackageCounter(),
        this.telemetryObject.getTime(),
        this.telemetryObject.getTimestampConverted(),
        // currentTelemetry.getType(),
        // currentTelemetry.getBatteryVoltage(),
        // currentTelemetry.getCurrentVoltage(),
      ];
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

