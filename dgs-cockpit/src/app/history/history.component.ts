import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import {telemetryDictonary} from '../models/config/telemetryDic';
import { Subscription } from 'rxjs/Subscription';
import { TelemetryService } from '../services/telemetry.service';
import { TelemetryObject } from '../models/objects/TelemetryObject';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})

export class HistoryComponent implements OnInit, OnDestroy {
  private telemetrySubscription: Subscription;

  private activeCharts: Chart[];
  private multiChart = new Chart('Mehrere Werte', [''], [], [], []);

  private allChartData: Array<TelemetryObject> = [];

  constructor(private telemetryService: TelemetryService) {
    this.activeCharts = new Array<Chart>();
   }

   ngOnInit(): void {

    this.telemetrySubscription = this.telemetryService.getAllTelemetrys().subscribe((teleObjects) => {
      const tmpGap = Math.max(1, Math.round(teleObjects.length / 500));

      for (let index = 0; index < teleObjects.length; index += tmpGap) {
        if(index > teleObjects.length) {
          this.allChartData.push(teleObjects[teleObjects.length - 1]);
        } else {
          this.allChartData.push(teleObjects[index]);
        }
      }

      this.activeCharts.forEach((chart) => {
        const tmpLabels = this.createLabelsFromTelemetry();
        const tmpData = this.createDataFromTelemetry(chart.parameterToDisplay);
        const tmpColor = this.createColorSchemas(chart.parameterToDisplay);

        chart.chartDatasets = tmpData;
        chart.chartLabels = tmpLabels;
        chart.chartColors = tmpColor;
      });

    });
  }

  createColorSchemas(parameterToDisplay: string[]) {
    const tmpColorSchemas: Array<SeriesStyling> = [];
    parameterToDisplay.forEach((str) => {
      tmpColorSchemas.push(new SeriesStyling());
    });
    return tmpColorSchemas;
  }

  createDataFromTelemetry(parameterToDisplay: string[]) {
    const tmpChartData: Array<Series> = [];
    parameterToDisplay.forEach((str) => {
      const tmpSeries = new Series([], str);

      this.allChartData.forEach((teleObj) => {
        tmpSeries.data.push(teleObj[str]);
        tmpSeries.label = telemetryDictonary[str].name;
      });
      tmpChartData.push(tmpSeries);
      console.log('Data Points ' + tmpSeries.data.length);
    });
    return tmpChartData;
  }

  createLabelsFromTelemetry() {
    const tmpChartLabels = [];
    this.allChartData.forEach((teleObj) => {
      tmpChartLabels.push(teleObj.getTimestampConverted().value);
    });
    return tmpChartLabels;
  }

  ngOnDestroy() {
    this.telemetrySubscription.unsubscribe();
  }

  selectionChanged(selection: any) {
    if (!selection) {
      return;
    }

    if (!selection.parameters) {
      return;
    }

    // check if select or deselect
    if(selection.parameters.length > this.activeCharts.length) {
      this.addChartToSelection(selection);
    } else {
      this.removeChartFromSelection(selection);
    }
  }

  private addChartToSelection(selection: any) {
    const newChart = new Array<Chart>();

    // add new charts
    if (selection.multi) {
      this.multiChart.parameterToDisplay = selection.parameters;
      newChart.push(this.multiChart);
      this.activeCharts = newChart;
    } else {
      selection.parameters.forEach((param: string) => {
        let title = param;

        if (telemetryDictonary[param].name) {
          title = telemetryDictonary[param].name;
        }

        let existsAlready = this.activeCharts.find(chart => {
          return chart.title === title;
        });

        if (existsAlready) {
          return;
        }

        const chart = new Chart(title, [param],
                                this.createDataFromTelemetry([param]),
                                this.createLabelsFromTelemetry(),
                                this.createColorSchemas([param]));
        this.activeCharts.push(chart);
      });
    }
  }

  private removeChartFromSelection(selection: any) {
    this.activeCharts.forEach((chart) => {
      let chartFound = selection.parameters.find((param) => {
        let title = param;

        if (telemetryDictonary[param].name) {
          title = telemetryDictonary[param].name;
        }

        return chart.title === title;
      });

      if(!chartFound) {   // delete chart if not found in selection
        let index = this.activeCharts.indexOf(chart, 0);
        if (index > -1) {
          this.activeCharts.splice(index, 1);
        }
      }
    });
  }
}

export class Chart {
  title: string;
  parameterToDisplay: string[];
  chartDatasets: Array<Series> = [];
  chartLabels: Array<string> = [];
  chartColors: Array<SeriesStyling> = [];

  constructor(title: string, parameterToDisplay: string[],
              chartDatasets: Array<Series>,
              chartLabels: Array<string>,
              chartColors: Array<SeriesStyling>) {
    this.title = title;
    this.parameterToDisplay = parameterToDisplay;
    this.chartDatasets = chartDatasets;
    this.chartLabels = chartLabels;
    this.chartColors = chartColors;
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