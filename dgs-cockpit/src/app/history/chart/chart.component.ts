import {Component, Input} from '@angular/core';
import * as d3 from 'd3';
import { colorSets as ngxChartsColorsets } from '@swimlane/ngx-charts/release/utils/color-sets';
import { TelemetryService } from '../../services/telemetry.service';
import { TelemetryObject } from '../../models/objects/TelemetryObject';
import {TimerObservable} from 'rxjs/observable/TimerObservable';
import { Subscription } from 'rxjs/Subscription';
import {telemetryDictonary} from '../../models/config/telemetryDic';
import 'rxjs/add/operator/do';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})

export class ChartComponent {
  @Input()  title: string;
  @Input()  parameter: string[];

  view: any[] = [700, 400];

  // options
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = 'Zeit';
  showYAxisLabel = true;
  yAxisLabel = 'Wert';
  colorScheme: any;

  // telemetryList: TelemetryObject[];
  currentChartData: Series[];
  newChartData: Series[];
  subscription: Subscription;
  show: boolean;
  public visible = false;
  // line interpolation
  curveType = 'Natural';
  curve = d3.curveNatural;
  schemeType = 'ordinal';

  constructor(private telemetryService: TelemetryService) {
    this.currentChartData = new Array<Series>();
    this.newChartData     = new Array<Series>();
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
    this.setColorScheme('natural');
    this.show = true;

    this.telemetryService.getTelemetryObservable().subscribe((teleObjects) => {
      teleObjects.forEach((teleObject) => {
        this.createSeriesFromTelemetry(teleObject);
      });
      this.updateChartSelection();
    });
  }

  updateChartSelection() {
    if (this.currentChartData !== this.newChartData) {
      console.log('Refreshing chart data');
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
          if (telemetryDictonary[result.name]) {
            result.name = telemetryDictonary[result.name].name;   // set parameter text
          }
          for (const p in tele) {
            if (p === str) {

              const entry = new SeriesEntry(tele.getTimestampConverted().value, tele[p]);

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
    if (event) {
      this.setInterpolationType(event.target.value);
    }
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
    this.colorScheme = ngxChartsColorsets.find(s => s.name === name);
  }

  onLegendLabelClick(entry) {
    console.log('Legend clicked', entry);
  }

  // tslint:disable-next-line:use-life-cycle-interface
  ngOnDestroy() {
    console.log('Destroy component');
  }
}

export class SeriesEntry {
  constructor(public name: Date | string, public value: number) {}
}

export class Series {
  constructor(public name: string, public series: SeriesEntry[]) {}
}
