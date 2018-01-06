import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartComponent } from './chart/chart.component';
import { SelectionComponent } from './selection/selection.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [ChartComponent, SelectionComponent]
})
export class HistoryModule { }
