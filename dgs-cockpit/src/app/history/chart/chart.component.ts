import {Component, OnInit, Input} from '@angular/core';
import {Http} from '@angular/http';
import * as d3 from 'd3';
import { colorSets as ngxChartsColorsets } from '@swimlane/ngx-charts/release/utils/color-sets';
import { TelemetryService } from '../../services/telemetry.service';
import { TelemetryObject } from '../../models/objects/TelemetryObject';
import { TelemetryInternal } from '../../models/Telemetry';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})

export class ChartComponent {
  @Input()  title: string;
  @Input()  parameter: string[];

  showSpeed: boolean;
  showExtTemp: boolean;
  showCPUTemp: boolean;
  showBoxTemp: boolean;
  showAlt: boolean;
  showPressure: boolean;

  currentChartData: Series[];
  newChartData: Series[];

  altSeries: Series;
  tempExtSeries: Series;
  tempCPUSeries: Series;
  tempBoxSeries: Series;
  speedSeries: Series;
  pressureSeries: Series;

  altSerieEntrys = new Array<SeriesEntry>();
  tempExtSerieEntrys = new Array<SeriesEntry>();
  tempCPUSerieEntrys = new Array<SeriesEntry>();
  tempBoxSerieEntrys = new Array<SeriesEntry>();
  speedSerieEntrys = new Array<SeriesEntry>();
  pressureSerieEntrys = new Array<SeriesEntry>();


  show: boolean;
  view = [600, 400];
  public visible = false;
  // line interpolation
  curveType = 'Linear';
  curve = d3.curveLinear;
  colorScheme: any;
  schemeType = 'ordinal';
  selectedColorScheme: string;

  constructor(private telSvc: TelemetryService) {
    this.show = false;
    this.setColorScheme('cool');
    this.currentChartData = new Array<Series>();
    this.newChartData = new Array<Series>();

    this.altSeries = new Series('Höhe', this.altSerieEntrys);
    this.tempExtSeries = new Series('Temperatur: Extern', this.tempExtSerieEntrys);
    this.tempCPUSeries = new Series('Temperatur: CPU', this.tempCPUSerieEntrys);
    this.tempBoxSeries = new Series('Temperatur: Box', this.tempCPUSerieEntrys);
    this.speedSeries = new Series('Geschwindigkeit', this.speedSerieEntrys);
    this.pressureSeries = new Series('Druck', this.pressureSerieEntrys);

    this.newChartData.push(this.altSeries);
    this.newChartData.push(this.tempExtSeries);
    this.newChartData.push(this.tempCPUSeries);
    this.newChartData.push(this.tempBoxSeries);
    this.newChartData.push(this.speedSeries);
    this.newChartData.push(this.pressureSeries);

    this.telSvc.getData().subscribe((data) => {
      for (let index = 0; index < data.length; index++) {
        this.telSvc.getTelemetryById(data[index])
          .then((tele: TelemetryInternal) => {
            this.createSeriesFromTelemetry(new TelemetryObject(tele));
          });
      }
    });
  }

  // tslint:disable-next-line:use-life-cycle-interface
  ngOnInit(): void {
    this.show = true;
  }
  onClickMe() {
    this.currentChartData = this.newChartData;
  }

  updateChartSelection() {
    if (!this.showAlt) { this.newChartData.splice(this.newChartData.indexOf(this.altSeries)); }
    if (!this.showExtTemp) { this.newChartData.splice(this.newChartData.indexOf(this.tempExtSeries)); }
    if (!this.showCPUTemp) { this.newChartData.splice(this.newChartData.indexOf(this.tempCPUSeries)); }
    if (!this.showBoxTemp) { this.newChartData.splice(this.newChartData.indexOf(this.tempBoxSeries)); }
    if (!this.showSpeed) { this.newChartData.splice(this.newChartData.indexOf(this.speedSeries)); }
    if (!this.showPressure) { this.newChartData.splice(this.newChartData.indexOf(this.pressureSeries)); }
    this.currentChartData = this.newChartData;
  }

  createSeriesFromTelemetry(tele: TelemetryObject) {
    const telDate = new Date(tele.timestamp);

    // this.newChartData[this.newChartData.indexOf(this.tempExtSeries)].series.push(new SeriesEntry(telDate, tele.temp_extern));
    // this.newChartData[this.newChartData.indexOf(this.tempCPUSeries)].series.push(new SeriesEntry(telDate, tele.temp_chip));
    // this.newChartData[this.newChartData.indexOf(this.tempBoxSeries)].series.push(new SeriesEntry(telDate, tele.temp_case));
    // this.newChartData[this.newChartData.indexOf(this.altSeries)].series.push(new SeriesEntry(telDate, tele.alt));
    // this.newChartData[this.newChartData.indexOf(this.pressureSeries)].series.push(new SeriesEntry(telDate, tele.pressure));
    this.newChartData[this.newChartData.indexOf(this.speedSeries)].series.push(new SeriesEntry(telDate, tele.speed));
  }

  select(data): void {
    console.log('Item clicked', data);
    this.currentChartData = this.newChartData;
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
  /*
  // lineChart
  public lineChartData:Array<any> = [
    {data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A'},
    {data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B'},
    {data: [18, 48, 77, 9, 100, 27, 40], label: 'Series C'}
  ];
  public lineChartLabels:Array<any> = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
  public lineChartOptions:any = {
    responsive: true
  };
  public lineChartColors:Array<any> = [
    { // grey
      backgroundColor: 'rgba(148,159,177,0.2)',
      borderColor: 'rgba(148,159,177,1)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    },
    { // dark grey
      backgroundColor: 'rgba(77,83,96,0.2)',
      borderColor: 'rgba(77,83,96,1)',
      pointBackgroundColor: 'rgba(77,83,96,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(77,83,96,1)'
    },
    { // grey
      backgroundColor: 'rgba(148,159,177,0.2)',
      borderColor: 'rgba(148,159,177,1)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    }
  ];
  public lineChartLegend:boolean = true;
  public lineChartType:string = 'line';

  public randomize():void {
    let _lineChartData:Array<any> = new Array(this.lineChartData.length);
    for (let i = 0; i < this.lineChartData.length; i++) {
      _lineChartData[i] = {data: new Array(this.lineChartData[i].data.length), label: this.lineChartData[i].label};
      for (let j = 0; j < this.lineChartData[i].data.length; j++) {
        _lineChartData[i].data[j] = Math.floor((Math.random() * 100) + 1);
      }
    }
    this.lineChartData = _lineChartData;
  }

  // events
  public chartClicked(e:any):void {
    console.log(e);
  }

  public chartHovered(e:any):void {
    console.log(e);
  }*/
}
export class SeriesEntry {
  constructor(public name: string | Date, public value: number) {}
}

export class Series {
  constructor(public name: string, public series: SeriesEntry[]) {}
}