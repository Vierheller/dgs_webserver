import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material';
import { MatTabsModule } from '@angular/material/tabs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSliderModule } from '@angular/material/slider';
import { MatTableModule } from '@angular/material/table';
import { MatGridListModule } from '@angular/material/grid-list';

import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { PictureComponent } from './dashboard/picture/picture.component';
import { TelemetryComponent } from './dashboard/telemetry/telemetry.component';
import { TimelineComponent } from './dashboard/timeline/timeline.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ChartComponent } from './history/chart/chart.component';
import { SelectionComponent } from './history/selection/selection.component';
import { HistoryComponent } from './history/history.component';
import { LogComponent } from './log/log.component';


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    FooterComponent,
    PictureComponent,
    TelemetryComponent,
    TimelineComponent,
    DashboardComponent,
    ChartComponent,
    SelectionComponent,
    HistoryComponent,
    LogComponent,
  ],
  imports: [
    BrowserModule,
    MatButtonModule,
    MatTabsModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatCardModule,
    MatExpansionModule,
    MatSliderModule,
    MatTableModule,
    MatGridListModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
