import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import {telemetryDictonary} from '../models/config/telemetryDic';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})

export class HistoryComponent implements OnInit {
  multiMode = false;
  activeCharts: Chart[];

  multiChart = new Chart('Mehrere Werte', ['']);

  constructor(private ref: ChangeDetectorRef) {
    this.activeCharts = new Array<Chart>();
   }

  ngOnInit() {
  }

  selectionChanged(selection: any) {
    if (!selection) {
      return;
    }

    console.log('selection');
    console.log(selection);

    if (!selection.parameters) {
      return;
    }

    const newChart = new Array<Chart>();

    if (selection.multi) {
      this.multiChart.parameterToDisplay = selection.parameters;
      newChart.push(this.multiChart);
    } else {
      selection.parameters.forEach((param) => {
        let title = param;

        if (telemetryDictonary[param].name) {
          title = telemetryDictonary[param].name;
        }
        const chart = new Chart(title, [param]);
        newChart.push(chart);
      });
    }

    this.activeCharts = newChart;
    // this.ref.detectChanges();
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
