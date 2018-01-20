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
import { ChartsModule } from 'ng2-charts';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { NgModel } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { AngularCesiumModule, MapEventsManagerService, MapsManagerService, ViewerConfiguration, CameraService } from 'angular-cesium';

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
import { DatabaseConnectorService} from './services/database-connector/database-connector.service';
import { TelemetryService } from './services/telemetry.service';
import { ImageService } from './services/image.service';
import { LogService } from './services/log.service';
import { MapComponent } from './map/map.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { CesiumProviderService } from './services/cesium-provider/cesium-provider.service';

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
    NgModel,
    MapComponent
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
    MatListModule,
    MatIconModule,
    MatGridListModule,
    ChartsModule,
    MatSlideToggleModule,
    MatCheckboxModule,
    FlexLayoutModule,
    NgxChartsModule,
    AngularCesiumModule.forRoot()
  ],
  providers: [
    DatabaseConnectorService,
    TelemetryService,
    LogService,
    ImageService,
    //MapEventsManagerService,
    //MapsManagerService,
    //ViewerConfiguration,
    //CameraService,
    CesiumProviderService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
