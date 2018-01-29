import { Component, OnInit } from '@angular/core';
import {TelemetryService} from "../../services/telemetry.service";
import {TelemetryElement, TelemetryObject} from "../../models/objects/TelemetryObject";
import {ImageService} from "../../services/image.service";
import {Image} from "../../models/Image";

@Component({
  selector: 'app-picture',
  templateUrl: './picture.component.html',
  styleUrls: ['./picture.component.css']
})
export class PictureComponent implements OnInit {

  lastTelemetry: TelemetryObject;
  lastPicture: Image;
  smallTelemetryOutput = new Array<TelemetryElement>();

  constructor(private telemetrieService: TelemetryService, private imageService: ImageService) {
    this.lastTelemetry = new TelemetryObject();
  }

  ngOnInit() {
    // get last telemetry data
    this.telemetrieService.getData().subscribe((data) => {
      this.telemetrieService.getTelemetryById(data[data.length - 1])
        .then((tele) => {
          this.lastTelemetry = tele;
          this.generateOutputRows();
        });
    });

    // get last picture
    this.imageService.getData().subscribe((data) => {
      this.imageService.getImageById(data[data.length - 1])
        .then((img) => {
          this.lastPicture = img;
        });
    });
  }

  private generateOutputRows() {
    this.smallTelemetryOutput = [
      this.lastTelemetry.getSpeed(),
      this.lastTelemetry.getDirection(),
      this.lastTelemetry.getPressure(),
    ];
  }

  private convertTimestampToTime(timestamp: number):string {
    let date = new Date(timestamp);
    return date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
  }
}
