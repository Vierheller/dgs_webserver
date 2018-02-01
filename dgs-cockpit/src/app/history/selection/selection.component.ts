import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import {forEach} from "@angular/router/src/utils/collection";

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
  selectedParams: string[];

  @Output() selectionChanged = new EventEmitter<string[]>();

  constructor() {
    this.updateChartSelection.bind(this);
    this.showSpeed = false;
    this.showExtTemp = false;
    this.showCPUTemp = false;
    this.showBoxTemp = false;
    this.showAlt = false;
    this.showPressure = false;
    this.selectedParams = new Array()
   }

  ngOnInit() {
  }

  updateChartSelection(event) {
    if(event.target) {
      if(event.target.checked) {    // if item is selected
        this.selectedParams.push(event.target.name);    // add selection
      } else {
        for(let i=0; i<this.selectedParams.length; i++) {     // remove selection
          if(this.selectedParams[i] === event.target.name) {
            this.selectedParams.splice(i, 1);
            break;
          }
        }
      }
    }

    this.selectionChanged.emit(this.selectedParams);
  }

}

