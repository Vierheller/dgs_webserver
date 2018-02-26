import { Component, OnInit } from '@angular/core';
import { TelemetryService } from '../../services/telemetry.service';
import {TelemetryElement, TelemetryObject} from '../../models/objects/TelemetryObject';
import {Promise} from 'q';
import {TimelineComponent} from '../timeline/timeline.component';

@Component({
  selector: 'app-telemetry',
  templateUrl: './telemetry.component.html',
  styleUrls: ['./telemetry.component.css']
})

export class TelemetryComponent implements OnInit {
  collapseState: string;
  collapseText: string;
  historyMode: boolean;
  currTelePtr: number;
  telemetryList: Array<TelemetryObject>;
  outputWeather: Array<TelemetryElement>;
  outputMovement: Array<TelemetryElement>;
  outputOthers: Array<TelemetryElement>;

  constructor(private telemetryService: TelemetryService) {
    this.collapseText = 'Parameter einblenden';
    this.historyMode = false;
    this.currTelePtr = 0;
    this.telemetryList = new Array<TelemetryObject>();
    this.outputWeather = new Array<TelemetryElement>();
    this.outputMovement = new Array<TelemetryElement>();
    this.outputOthers = new Array<TelemetryElement>();
    this.telemetryList.push(new TelemetryObject());
    this.generateTelemetryToOutput();   // set the init values to UI
  }

  ngOnInit() {
    this.telemetryService.getTelemetryObservable().subscribe((teleObjects) => {
      this.telemetryList = teleObjects;

      if (!this.historyMode) {
        this.currTelePtr = teleObjects.length - 1;
        this.generateTelemetryToOutput();
      }
    });

    // when custom time has been selected by user
    this.telemetryService.timelineEvent.subscribe((index) => {
      if (this.telemetryList) {
        this.currTelePtr = index;
        this.generateTelemetryToOutput();

        this.historyMode = this.telemetryList.length > index;   // disable historyMode if slider is on max
      }
    });
  }

  // build list for UI
  generateTelemetryToOutput() {
    if (this.currTelePtr >= 0) {
      let currentTelemetry = this.telemetryList[this.currTelePtr];

      this.outputWeather = [
        currentTelemetry.getPressure(),
        currentTelemetry.getHumidity(),
        currentTelemetry.getWindDirection(),
        currentTelemetry.getTempExtern(),
        currentTelemetry.getTempCase(),
        currentTelemetry.getTempChip(),
      ];

      this.outputMovement = [
        currentTelemetry.getDMS(),
        currentTelemetry.getTime(),
        //currentTelemetry.getLat(),
        //currentTelemetry.getLon(),
        currentTelemetry.getAlt(),
        currentTelemetry.getSpeed(),
        currentTelemetry.getDirectionCombined(),
        currentTelemetry.getDistance(this.telemetryList[0].getLat().value, this.telemetryList[0].getLon().value)
      ];

      if(this.currTelePtr > 0) {
        this.outputMovement.push(currentTelemetry.getRiseRate(
          this.telemetryList[this.currTelePtr - 1].getAlt().value,
          this.telemetryList[this.currTelePtr - 1].getTime().value
        ));
      } else {
        this.outputMovement.push(currentTelemetry.getRiseRate(
          currentTelemetry.getAlt().value,
          currentTelemetry.getTime().value
        ));
      }

      this.outputOthers = [
        //currentTelemetry.getClass(),
        //currentTelemetry.getIndex(),
        currentTelemetry.getSatellites(),
        currentTelemetry.getChannel(),
        //currentTelemetry.getPayload(),
        currentTelemetry.getPackageCounter(),
        currentTelemetry.getTimestampConverted(),
        //currentTelemetry.getType(),
        //currentTelemetry.getBatteryVoltage(),
        //currentTelemetry.getCurrentVoltage(),
      ];
    }
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

