import {ChangeDetectorRef, Component, Input, OnDestroy, OnInit} from '@angular/core';
import { TelemetryService } from '../../services/telemetry.service';
import { TelemetryObject } from '../../models/objects/TelemetryObject';
import 'rxjs/add/operator/do';
import {telemetryDictonary} from "../../models/config/telemetryDic";
import {Subscription} from "rxjs/Subscription";

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})

export class ChartComponent implements OnInit, OnDestroy {
  private telemetrySubscription: Subscription;

  @Input()  title: string;
  @Input()  parameter: string[];

  public chartType = 'line';

  public chartDatasets: Array<Series> = [];
  public chartLabels: Array<string> = [];
  public chartColors: Array<SeriesStyling> = [];

  public chartOptions: any = { responsive: true };

  constructor(private telemetryService: TelemetryService) {

  }

  ngOnInit(): void {
    this.initializeChart();

    this.telemetrySubscription = this.telemetryService.getAllTelemetrys().subscribe((teleObjects) => {
      teleObjects.forEach((teleObject) => {
        this.createSeriesFromTelemetry(teleObject);
      });
    });
  }

  ngOnDestroy() {
    this.telemetrySubscription.unsubscribe();
  }

  initializeChart() {
    for (let index = 0; index < this.parameter.length; index++) {
      this.chartDatasets.push(new Series([], telemetryDictonary[this.parameter[index]].name));
      this.chartColors.push(new SeriesStyling());
    }
  }

  createSeriesFromTelemetry(tele: TelemetryObject) {
    let result: Series;

    this.chartLabels.push(tele.getTimestampConverted().value);

    if (this.parameter) {
      for (const str of this.parameter) {
        result = this.chartDatasets.find(series => {
          return series.label === telemetryDictonary[str].name;
        });

        if (result) {
          result.data.push(tele[str]);
          result.label = telemetryDictonary[str].name;
        }
      }

      this.chartDatasets = [];
      this.chartDatasets.push(result);
    }
  }

  public chartClicked(e: any): void {

  }

  public chartHovered(e: any): void {

  }
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
    public pointHoverBorderColor: string =  'rgba(220,220,220,1)') {
  }
}
