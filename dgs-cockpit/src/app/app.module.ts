import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ChartsModule } from 'ng2-charts';
import { NgModel } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AngularCesiumModule, MapEventsManagerService, MapsManagerService, ViewerConfiguration, CameraService } from 'angular-cesium';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MDBBootstrapModule } from 'angular-bootstrap-md';

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
    MDBBootstrapModule.forRoot(),
    BrowserModule,
    BrowserAnimationsModule,
    ChartsModule,
    FlexLayoutModule,
    NgxChartsModule,
    AngularCesiumModule.forRoot()
  ],
  providers: [
    DatabaseConnectorService,
    TelemetryService,
    LogService,
    ImageService,
    // MapEventsManagerService,
    // MapsManagerService,
    // ViewerConfiguration,
    // CameraService,
    CesiumProviderService
  ],
  bootstrap: [AppComponent],
  schemas: [ NO_ERRORS_SCHEMA ]
})
export class AppModule { }
