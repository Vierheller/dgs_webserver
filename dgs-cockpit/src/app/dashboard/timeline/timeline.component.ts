import {Component, OnInit} from '@angular/core';
import {TelemetryService} from '../../services/telemetry.service';
import {TelemetryObject} from '../../models/objects/TelemetryObject';
import {TimerObservable} from 'rxjs/observable/TimerObservable';
import { Observable } from 'rxjs/Observable';
import { Subscriber } from 'rxjs/Subscriber';
import { Subscription } from 'rxjs/Subscription';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { tree } from 'd3';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.css']
})
export class TimelineComponent implements OnInit {
  timelineSliderValue: number;
  timelineMax: number;
  nextTelemetryObjects: Array<TelemetryObject>;
  selectedTelemetryId: string;


  // States
  playMode: boolean;
  loopMode: boolean;
  liveMode: boolean;

  private timerObserver: Observable<number>;
  private timerSubscripton: Subscription;

  private currentTelemetryIndex: BehaviorSubject<number> = new BehaviorSubject(0);
  private lookupSize: BehaviorSubject<number> = new BehaviorSubject(5);

  constructor(private telemetryService: TelemetryService) {
    this.playMode = false;
    this.loopMode = false;
    this.liveMode = true;
  }

  ngOnInit() {

    this.telemetryService.getTelemetryIdsObservable().subscribe((telemetryIds) => {
      // Automatic Mode
      if (this.playMode && this.liveMode) { // auto update list
        this.timelineSliderValue = telemetryIds.length;
        this.selectedTelemetryId = telemetryIds[telemetryIds.length - 1];

        this.telemetryService.currentTelemetryIdSubject.next(telemetryIds[telemetryIds.length - 1]);
      }

      this.timelineMax = telemetryIds.length;
    });

    this.telemetryService.getNextNTelemetry(this.currentTelemetryIndex, this.lookupSize).subscribe((nextTelemetryObjects) => {
      this.nextTelemetryObjects = nextTelemetryObjects;
    });
  }

  // select telemetry data
  changeTimeSelection(value: number) {
    if (value) {
      this.timelineSliderValue = value;
      this.telemetryService.timelineEvent.emit(this.timelineSliderValue - 1);    // trigger timeline event

      this.telemetryService.currentTelemetryIdSubject.next(this.nextTelemetryObjects[this.timelineSliderValue - 1]);

      if (this.nextTelemetryObjects) {
        this.selectedTelemetryId = this.nextTelemetryObjects[this.timelineSliderValue - 1];
      }
    }
  }

  startOrStopPlayingTrackedData() {
    if (!this.playMode) {
      if (this.timelineSliderValue === this.timelineMax) {
        this.timelineSliderValue = 1;
      }
      this.playTrackedData();
    }
    this.togglePlayButton();
  }

  // recursive
  playTrackedData() {
    if (this.loopMode && this.timelineSliderValue > this.timelineMax) {
      this.timelineSliderValue = 1;
    }

    this.telemetryService.timelineEvent.emit(this.timelineSliderValue - 1);
    this.selectedTelemetryId = this.nextTelemetryObjects[this.timelineSliderValue - 1];

    if (!this.loopMode && this.timelineSliderValue === this.timelineMax) {
      this.togglePlayButton();
      return;
    }

    setTimeout(() => {
      if (this.playMode) {
        this.timelineSliderValue++;
        this.playTrackedData();   // next step recursive
      }
    }, 2000);
  }

  private play() {
    const currentElement = this.currentTelemetryIndex;
    const nextElement = this.nextTelemetryObjects[1];
  }

  togglePlayButton() {
    this.playMode = !this.playMode;

    if (this.playMode) {
      this.timerObserver = TimerObservable.create(0, 500);
      this.timerSubscripton = this.timerObserver.subscribe(() => {
        this.play();
      });
    } else {
      this.timerSubscripton.unsubscribe();
    }
  }

  toggleRepeatMode() {
    this.loopMode = !this.loopMode;
  }
}
