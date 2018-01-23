import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { SelectionComponent } from './selection/selection.component';
import { ViewChild } from '@angular/core';

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
  activeCharts: Chart[];

  speedChart = new Chart('Geschwindigkeit', ['speed']);
  tempChart = new Chart('Temperatur', ['temp_extern', 'temp_case', 'temp_chip']);
  altChart = new Chart('Höhe', ['alt']);
  pressureChart = new Chart('Druck', ['pressure']);

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
    }
    console.log(selection);
    const newChart = new Array<Chart>();
    if (this.showSpeed) {
      newChart.push(this.speedChart);
    }
    if (this.showExtTemp) {
      newChart.push(this.tempChart);
    }
    if (this.showAlt) {
      newChart.push(this.altChart);
    }
    if (this.showPressure) {
      newChart.push(this.pressureChart);
    }
    console.log(this.activeCharts.length);
    console.log(newChart.length);
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
