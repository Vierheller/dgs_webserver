import {Component, OnInit, Input} from '@angular/core';
import {Http} from '@angular/http';
import * as d3 from 'd3';
import { colorSets as ngxChartsColorsets } from '@swimlane/ngx-charts/release/utils/color-sets';
import { TelemetryService } from '../../services/telemetry.service';
import { TelemetryObject } from '../../models/objects/TelemetryObject';
import { TelemetryInternal } from '../../models/Telemetry';
import {TimerObservable} from 'rxjs/observable/TimerObservable';
import { Subscription } from 'rxjs/Subscription';
import { entries } from 'd3';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})

export class ChartComponent {
  @Input()  title: string;
  @Input()  parameter: string[];

  // telemetryList: TelemetryObject[];
  currentChartData: Series[];
  newChartData: Series[];
  subscription: Subscription;
  show: boolean;
  view = [600, 400];
  public visible = false;
  // line interpolation
  curveType = 'Natural';
  curve = d3.curveLinear;
  colorScheme: any;
  schemeType = 'ordinal';
  selectedColorScheme: string;

  constructor(private telSvc: TelemetryService) {
    this.setColorScheme('cool');
    this.currentChartData = new Array<Series>();
    this.newChartData     = new Array<Series>();
    // this.telemetryList = new Array<TelemetryObject>();
  }

  initChartDataSources() {
    if (this.parameter) {
      for (const str of this.parameter) {
        this.newChartData.push(new Series(str, new Array<SeriesEntry>()));
      }
    }
  }

  // tslint:disable-next-line:use-life-cycle-interface
  ngOnInit(): void {
    this.show = true;
    const timer = TimerObservable.create(500, 5000);
    this.subscription = timer.subscribe(t => {
      // if (this.telemetryList !== this.telSvc.telemetryList) {
        /*this.telemetryList = this.telemetryList.concat(this.telSvc.telemetryList);
        console.log('LISTLENGTH ' + this.telemetryList.length);
        this.telemetryList.reduce((x, y) => x.findIndex(e => e.timestamp === y.timestamp) < 0 ? [...x, y] : x, []);
        console.log('LISTLENGTH ' + this.telemetryList.length);*/
        this.setInterpolationType('Basic');
        this.telSvc.telemetryList.forEach((teleObject) => {
          this.createSeriesFromTelemetry(teleObject);
        });
        this.updateChartSelection();
      // }
    });

    /*this.telSvc.getData().subscribe((data) => {
      for (let index = 0; index < data.length; index++) {
        this.telSvc.getTelemetryById(data[index])
          .then((tele: TelemetryInternal) => {
            this.createSeriesFromTelemetry(new TelemetryObject(tele));
          });
      }
    });*/
  }
  onClickMe() {
   // this.currentChartData = this.newChartData;
  }

  updateChartSelection() {
    if (this.currentChartData !== this.newChartData) {
      this.currentChartData = this.newChartData;
    }
  }

  createSeriesFromTelemetry(tele: TelemetryObject) {
    const telDate = new Date(tele.timestamp);
    if (this.currentChartData.length !== this.parameter.length) {
      this.initChartDataSources();
    }
    if (this.parameter) {
      for (const str of this.parameter) {
        const result = this.newChartData.find(series => series.name === str);
        if (result) {
          for (const p in tele) {
            if (p === str) {

              const entry = new SeriesEntry(telDate.toLocaleTimeString('de-DE'), tele[p]);

              result.series.push(entry);
            }
          }
        }
      }
    }
  }

  select(data): void {
    console.log('Item clicked', data);
  }

  changeInterpolationType(event) {
    if(event)
      this.setInterpolationType(event.target.value);
  }

  setInterpolationType(curveType) {
    this.curveType = curveType;
    if (curveType === 'Basis') {
      this.curve = d3.curveBasis;
    }
    if (curveType === 'Cardinal') {
      this.curve = d3.curveCardinal;
    }
    if (curveType === 'Catmull Rom') {
      this.curve = d3.curveCatmullRom;
    }
    if (curveType === 'Linear') {
      this.curve = d3.curveLinear;
    }
    if (curveType === 'Monotone X') {
      this.curve = d3.curveMonotoneX;
    }
    if (curveType === 'Monotone Y') {
      this.curve = d3.curveMonotoneY;
    }
    if (curveType === 'Natural') {
      this.curve = d3.curveNatural;
    }
    if (curveType === 'Step') {
      this.curve = d3.curveStep;
    }
    if (curveType === 'Step After') {
      this.curve = d3.curveStepAfter;
    }
    if (curveType === 'Step Before') {
      this.curve = d3.curveStepBefore;
    }
  }

  setColorScheme(name) {
    this.selectedColorScheme = name;
    this.colorScheme = ngxChartsColorsets.find(s => s.name === name);
  }

  onLegendLabelClick(entry) {
    console.log('Legend clicked', entry);
  }

  ngOnDestroy() {
    console.log('Destroy component');
    this.subscription.unsubscribe();
  }
}

export class SeriesEntry {
  constructor(public name: Date | string, public value: number) {}
}

export class Series {
  constructor(public name: string, public series: SeriesEntry[]) {}
}
