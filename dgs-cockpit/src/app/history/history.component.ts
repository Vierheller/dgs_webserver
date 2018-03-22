import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import {telemetryDictonary} from '../models/config/telemetryDic';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})

export class HistoryComponent implements OnInit {
  activeCharts: Chart[];

  multiChart = new Chart('Mehrere Werte', ['']);

  constructor() {
    this.activeCharts = new Array<Chart>();
   }

  ngOnInit() {
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
      selection.parameters.forEach((param) => {
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

        const chart = new Chart(title, [param]);
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

  constructor(title: string, parameterToDisplay: string[]) {
    this.title = title;
    this.parameterToDisplay = parameterToDisplay;
  }
}
