import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PictureComponent } from './picture/picture.component';
import { TelemetryComponent } from './telemetry/telemetry.component';
import { TimelineComponent } from './timeline/timeline.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [PictureComponent, TelemetryComponent, TimelineComponent]
})
export class DashboardModule { }
