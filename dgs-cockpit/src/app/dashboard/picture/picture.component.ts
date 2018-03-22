import {Component, OnInit, OnDestroy, ChangeDetectorRef} from '@angular/core';
import {TelemetryService} from '../../services/telemetry.service';
import {TelemetryElement, TelemetryObject} from '../../models/objects/TelemetryObject';
import {ImageService} from '../../services/image.service';
import {ImageObject} from '../../models/objects/ImageObject';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-picture',
  templateUrl: './picture.component.html',
  styleUrls: ['./picture.component.css']
})
export class PictureComponent implements OnInit, OnDestroy {
  private telemetrySubscription: Subscription;
  private imageSubscription: Subscription;
  private timelineSubscription: Subscription;

  selTelemetry: TelemetryObject;
  lastPicture: ImageObject;
  pictureList: Array<ImageObject>;
  smallTelemetryOutput: Array<TelemetryElement>;
  selIndex: number;

  constructor(private ref: ChangeDetectorRef, private telemetryService: TelemetryService,
              private imageService: ImageService) {
    this.pictureList = new Array<ImageObject>();
    this.smallTelemetryOutput = new Array<TelemetryElement>();
  }

  ngOnInit() {
    this.selIndex = 0;

    // get telemetry data
    this.telemetrySubscription = this.telemetryService.getTelemetryForCurrentId().subscribe((telemetry) => {
      this.selTelemetry = telemetry;
      this.generateOutputRows();
      this.ref.detectChanges();
    });

    // get image data
    this.imageSubscription = this.imageService.getImageObservable().subscribe((imgObjects) => {
      this.lastPicture = imgObjects[imgObjects.length - 1];
      this.pictureList = imgObjects;
    });

    // when custom time has been selected by user
    this.timelineSubscription = this.telemetryService.timelineEvent.subscribe((index) => {
      if (this.pictureList) {
        this.lastPicture = this.calcNearestPicture(this.selTelemetry.getTimestamp().value);
      }
    });
  }

  ngOnDestroy() {
    this.telemetrySubscription.unsubscribe();
    this.timelineSubscription.unsubscribe();
    this.imageSubscription.unsubscribe();
  }

  // return the picture which fits to the given timestamp most
  calcNearestPicture(timestamp: number): ImageObject {
    for (let i = 0; i < this.pictureList.length; i++) {
      if (this.pictureList[i].timestamp >=  timestamp) {  // select first pic which is higher than timestamp
        return this.pictureList[i];
      }
    }

    return this.lastPicture;  // if nothing found
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
    if (this.selTelemetry) {
      this.smallTelemetryOutput = [
        this.selTelemetry.getSpeed(),
        this.selTelemetry.getDirectionCombined(),
        this.selTelemetry.getAlt(),
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
