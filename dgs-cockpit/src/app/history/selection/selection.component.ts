import { Component, EventEmitter, Output, OnInit } from '@angular/core';

@Component({
  selector: 'app-selection',
  templateUrl: './selection.component.html',
  styleUrls: ['./selection.component.css']
})
export class SelectionComponent implements OnInit {
  showSpeed: boolean;
  showExtTemp: boolean;
  showCPUTemp: boolean;
  showBoxTemp: boolean;
  showAlt: boolean;
  showPressure: boolean;

  @Output() selectionChanged = new EventEmitter<boolean[]>();

  constructor() {
    this.updateChartSelection.bind(this);
    this.showSpeed = false;
    this.showExtTemp = false;
    this.showCPUTemp = false;
    this.showBoxTemp = false;
    this.showAlt = false;
    this.showPressure = false;
   }

  ngOnInit() {
  }

  updateChartSelection(event) {
    for (const p in this) {
      if (p === event.target.name) {
        this[p] = event.target.checked;
      }
    }
    this.selectionChanged.emit([this.showSpeed, this.showExtTemp, this.showCPUTemp, this.showBoxTemp, this.showAlt, this.showPressure]);
  }

}

