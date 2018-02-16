import { Component, OnInit } from '@angular/core';
import {TelemetryService} from '../../services/telemetry.service';
import {TelemetryElement, TelemetryObject} from '../../models/objects/TelemetryObject';
import {ImageService} from '../../services/image.service';
import {Image} from '../../models/Image';

@Component({
  selector: 'app-picture',
  templateUrl: './picture.component.html',
  styleUrls: ['./picture.component.css']
})
export class PictureComponent implements OnInit {

  lastTelemetry: TelemetryObject;
  lastPicture: Image;
  telemetryCounter: number;
  pictureList = new Array<Image>();
  smallTelemetryOutput = new Array<TelemetryElement>();
  selIndex: number;

  constructor(private telemetryService: TelemetryService, private imageService: ImageService) {

  }

  ngOnInit() {
    this.selIndex = 0;
    this.telemetryService.getTelemetryObservable().subscribe((teleObjects) => {
      this.lastTelemetry = teleObjects[teleObjects.length - 1];
      this.generateOutputRows();
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
