import {Component, OnInit, ChangeDetectorRef, Output, EventEmitter} from '@angular/core';
import {TelemetryService} from "../services/telemetry.service";
import {TimerObservable} from "rxjs/observable/TimerObservable";
import {Subscription} from "rxjs/Subscription";
import {Promise} from "q";
import {TelemetryObject} from "../models/objects/TelemetryObject";

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})

export class HistoryComponent implements OnInit {
  subscription: Subscription;
  localTeleList: Array<TelemetryObject>;

  @Output() historyUpdated = new EventEmitter<Array<ChartData>>();

  constructor(private telemetryService: TelemetryService) {
    this.localTeleList = [];
  }

  ngOnInit() {
    const timer = TimerObservable.create(500, 5000);

    this.subscription = timer.subscribe(t => {
      this.telemetryService.telemetryList.forEach((data) => {
        this.localTeleList.push(data);
      });
    });
  }

  selectionChanged(selection: string[]) {
    const datasetList = new Array<ChartData>();
    let dataset: ChartData;

    for(let i=0; i<selection.length; i++) {   // select all parameters
      dataset = new ChartData(selection[i], this.getDataByName(selection[i]));
      datasetList.push(dataset);
    }

    this.historyUpdated.emit(datasetList);
  }

  getDataByName(name: string): any[] {
    const data = [];

    for(let i=0; i<this.localTeleList.length; i++) {
      switch(name) {
        case 'speed':
          data.push(this.localTeleList[i].getSpeed().value);
      }
    }

    return data;
  }
}

export class ChartData {
  label: string;    // exa: speed
  data: number[];   // exa: [1, 2, 3]

  constructor(label: string, data: number[]) {
    this.label = label;
    this.data = data;
  }
}

