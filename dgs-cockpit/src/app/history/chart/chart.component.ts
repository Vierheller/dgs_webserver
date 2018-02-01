import {Component} from '@angular/core';
import {ChartData, HistoryComponent} from "../history.component";

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})

export class ChartComponent {
  chartDatasets: Array<any>;
  chartType:string = 'line';

  chartLabels: Array<any>;

  public chartColors:Array<any> = [
    {
      backgroundColor: 'rgba(220,220,220,0.2)',
      borderColor: 'rgba(220,220,220,1)',
      borderWidth: 2,
      pointBackgroundColor: 'rgba(220,220,220,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(220,220,220,1)'
    },
    {
      backgroundColor: 'rgba(151,187,205,0.2)',
      borderColor: 'rgba(151,187,205,1)',
      borderWidth: 2,
      pointBackgroundColor: 'rgba(151,187,205,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(151,187,205,1)'
    }
  ];

  public chartOptions:any = {
    responsive: true
  };

  public chartClicked(e: any): void {

  }

  public chartHovered(e: any): void {

  }

  constructor(private history:HistoryComponent) {
    this.chartDatasets = [];
    this.chartLabels = [];

    history.historyUpdated.subscribe((data) => {
      this.refreshChart(data);
    });
  }

  refreshChart(data: ChartData[]) {
    let dataset: object;

    if(data) {
      for(let i=0; i<data.length; i++) {
        dataset = {data: data[i].data, label: data[i].label};
        this.chartDatasets.push(dataset);
      }
      console.log(this.chartDatasets);
    }
  }
}

export class SeriesEntry {
  constructor(public name: Date | string, public value: number) {}
}

export class Series {
  constructor(public name: string, public series: SeriesEntry[]) {}
}
