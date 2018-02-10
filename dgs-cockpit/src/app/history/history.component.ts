import { Component, OnInit, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})

export class HistoryComponent implements OnInit {
  showSpeed = false;
  showExtTemp = false;
  showCPUTemp = false;
  showBoxTemp = false;
  showAlt = false;
  showPressure = false;
  multiMode = false;
  activeCharts: Chart[];

  speedChart = new Chart('Geschwindigkeit', ['speed']);
  tempChart = new Chart('Temperatur', ['temp_extern', 'temp_case', 'temp_chip']);
  altChart = new Chart('Höhe', ['alt']);
  pressureChart = new Chart('Druck', ['pressure']);
  multiChart = new Chart('Mehrere Werte', ['']);

  constructor(private ref: ChangeDetectorRef) {
    this.activeCharts = new Array<Chart>();
   }

  ngOnInit() {
  }

  selectionChanged(selection: boolean[]) {
    if (selection) {
      this.showSpeed = selection[0];
      this.showExtTemp = selection[1];
      this.showCPUTemp = selection[2];
      this.showBoxTemp = selection[3];
      this.showAlt = selection[4];
      this.showPressure = selection[5];
      this.multiMode = selection[6];
    }

    const newChart = new Array<Chart>();

    if(this.multiMode) {
      const paramToDisplay = new Array<string>();

      if (this.showSpeed)
        paramToDisplay.push('speed');

      if (this.showExtTemp)
        paramToDisplay.push('temp_extern');

      if (this.showAlt)
        paramToDisplay.push('alt');

      if (this.showPressure)
        paramToDisplay.push('pressure');

      this.multiChart.parameterToDisplay = paramToDisplay;
      newChart.push(this.multiChart);
    } else {
      if (this.showSpeed)
        newChart.push(this.speedChart);

      if (this.showExtTemp)
        newChart.push(this.tempChart);

      if (this.showAlt)
        newChart.push(this.altChart);

      if (this.showPressure)
        newChart.push(this.pressureChart);
    }

    this.activeCharts = newChart;
    //this.ref.detectChanges();
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
