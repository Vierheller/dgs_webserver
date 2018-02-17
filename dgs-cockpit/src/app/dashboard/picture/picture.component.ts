import { Component, OnInit } from '@angular/core';
import {TelemetryService} from '../../services/telemetry.service';
import {TelemetryElement, TelemetryObject} from '../../models/objects/TelemetryObject';
import {ImageService} from '../../services/image.service';
import {ImageObject} from "../../models/objects/ImageObject";

@Component({
  selector: 'app-picture',
  templateUrl: './picture.component.html',
  styleUrls: ['./picture.component.css']
})
export class PictureComponent implements OnInit {

  lastTelemetry: TelemetryObject;
  lastPicture: ImageObject;
  telemetryCounter: number;
  pictureList: Array<ImageObject>;
  smallTelemetryOutput: Array<TelemetryElement>;
  selIndex: number;

  constructor(private telemetryService: TelemetryService, private imageService: ImageService) {
    this.pictureList = new Array<ImageObject>();
    this.smallTelemetryOutput = new Array<TelemetryElement>();
  }

  ngOnInit() {
    this.selIndex = 0;

    // get telemetry data
    this.telemetryService.getTelemetryObservable().subscribe((teleObjects) => {
      this.lastTelemetry = teleObjects[teleObjects.length - 1];
      this.generateOutputRows();
    });

    // get image data
    this.imageService.getImageObservable().subscribe((imgObjects) => {
      this.lastPicture = imgObjects[imgObjects.length - 1];
      this.pictureList = imgObjects;
    });
  }

  onDialogOpen() {
    this.selIndex = this.pictureList.length - 1;
  }

  loadPrevPicture() {
    if (this.selIndex - 1 >= 0) {
      this.selIndex--;
    }
  }

  loadNextPicture() {
    if (this.selIndex + 1 < this.pictureList.length) {
      this.selIndex++;
    }
  }

  private generateOutputRows() {
    if (this.lastTelemetry) {
      this.smallTelemetryOutput = [
        this.lastTelemetry.getSpeed(),
        this.lastTelemetry.getDirection(),
        this.lastTelemetry.getPressure(),
      ];
    }
  }

  convertTimestampToTime(timestamp?: number): string {
    if (timestamp) {
      const date = new Date(timestamp);
      return date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
    }
  }
}
