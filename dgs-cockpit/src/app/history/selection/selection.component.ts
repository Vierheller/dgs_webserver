import { Component, EventEmitter, Output, OnInit } from '@angular/core';

@Component({
  selector: 'app-selection',
  templateUrl: './selection.component.html',
  styleUrls: ['./selection.component.css']
})
export class SelectionComponent implements OnInit {
  multiChart: boolean;
  selection: string[];

  @Output() selectionChanged = new EventEmitter<any>();

  constructor() {
    this.updateChartSelection.bind(this);
    this.selection = new Array<string>();
    this.multiChart = false;
   }

  ngOnInit() {
  }

  updateChartSelection(event) {
    if(event.target.name === "multiChart")
      this.multiChart = event.target.checked;

    if(event.target.checked && event.target.name !== "multiChart") {
      this.selection.push(event.target.name);     // add selection
    } else {
      const index = this.selection.indexOf(event.target.name, 0);
      if (index > -1) {
        this.selection.splice(index, 1);    // remove selection
      }
    }

    this.selectionChanged.emit({'parameters': this.selection, 'multi': this.multiChart});
  }

}

