import {Component, Input} from '@angular/core';
import * as d3 from 'd3';
import { colorSets as ngxChartsColorsets } from '@swimlane/ngx-charts/release/utils/color-sets';
import { TelemetryService } from '../../services/telemetry.service';
import { TelemetryObject } from '../../models/objects/TelemetryObject';
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

  public chartType = 'line';

  public chartDatasets: Array<Series> = [];
  public chartLabels: Array<string> = [];
  public chartColors: Array<SeriesStyling> = [];

  public chartOptions: any = {
      responsive: true
  };

  constructor(private telemetryService: TelemetryService) {

  }

  // tslint:disable-next-line:use-life-cycle-interface
  ngOnInit(): void {
    this.setupChart();
    this.telemetryService.getTelemetryObservable().subscribe((teleObjects) => {
      teleObjects.forEach((teleObject) => {
        this.createSeriesFromTelemetry(teleObject);
      });
    });
  }

  setupChart() {
    for (let index = 0; index < this.parameter.length; index++) {
      this.chartDatasets.push(new Series([], this.parameter[index]));
      this.chartColors.push(new SeriesStyling());
    }
  }

  createSeriesFromTelemetry(tele: TelemetryObject) {
    this.chartLabels.push(tele.getTimestampConverted().value);
    if (this.parameter) {
      for (const str of this.parameter) {
        const result = this.chartDatasets.find(series => series.label === str);

        if (result) {
          for (const p in tele) {
            if (p === str) {
              result.data.push(tele[p]);
            }
          }
        }
      }
    }
  }

  public chartClicked(e: any): void {

  }

  public chartHovered(e: any): void {

  }
}
export class SeriesEntry {
  constructor(public name: Date | string, public value: number) {}
}

export class Series {
  constructor(public data: Array<number>, public label: string) {}
}
// ToDO: Generate color pattern for series
export class SeriesStyling {
  constructor(
    public backgroundColor: string = 'rgba(110,220,220,0.2)',
    public borderColor: string =  'rgba(220,220,220,1)',
    public borderWidth: number =  2,
    public pointBackgroundColor: string =  'rgba(20,220,220,1)',
    public pointBorderColor: string =  '#fff',
    public pointHoverBackgroundColor: string =  '#fff',
    public pointHoverBorderColor: string =  'rgba(220,220,220,1)') {}
}
  /*
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
  autoScale: true;

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

  onSelect(data): void {
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
}*/
