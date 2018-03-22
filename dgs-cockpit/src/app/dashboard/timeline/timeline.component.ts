import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {TelemetryService} from '../../services/telemetry.service';
import {TelemetryObject} from '../../models/objects/TelemetryObject';
import {TimerObservable} from 'rxjs/observable/TimerObservable';
import { Observable } from 'rxjs/Observable';
import { Subscriber } from 'rxjs/Subscriber';
import { Subscription } from 'rxjs/Subscription';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { tree } from 'd3';
import {Time} from '@angular/common';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.css']
})
export class TimelineComponent implements OnInit {
  private static TIMER_INTERVAL = 1000;

  timelineSliderValue: number;
  timelineMax: number;
  nextTelemetryObjects: Array<TelemetryObject>;
  selectedTelemetryId: string;

  private currentTelemetryObject: TelemetryObject;

  // time for time based looping
  private startTime = 0;
  private curTime = 0;

  // States
  private playMode: boolean;
  private loopMode: boolean;
  private liveMode: boolean;

  private allTelemetryIdsList: Array<string>;

  private timerObserver: Observable<number>;
  private timerSubscripton: Subscription;

  private lookupSize: BehaviorSubject<number> = new BehaviorSubject(5);

  constructor(private ref: ChangeDetectorRef, private telemetryService: TelemetryService) {
    this.playMode = true;
    this.loopMode = false;
    this.liveMode = true;

    this.allTelemetryIdsList = [];
  }

  ngOnInit() {

    this.telemetryService.getTelemetryIdsObservable().subscribe((telemetryIds) => {
      this.allTelemetryIdsList = telemetryIds;

      console.log("Update");
      // Automatic Mode
      if (this.playMode && this.liveMode) { // auto update list
        this.timelineSliderValue = telemetryIds.length;
        this.selectedTelemetryId = telemetryIds[telemetryIds.length - 1];

        this.telemetryService.currentTelemetryIdSubject.next(telemetryIds[telemetryIds.length - 1]);
      }
      this.timelineMax = telemetryIds.length;
      console.log(this.timelineSliderValue, this.timelineMax);
      this.ref.detectChanges();
    });

    this.telemetryService.getNextNTelemetry(this.telemetryService.currentTelemetryIdSubject, this.lookupSize)
      .subscribe((nextTelemetryObjects) => {
      this.nextTelemetryObjects = nextTelemetryObjects;
    });

    this.telemetryService.getTelemetryForCurrentId().subscribe((telemetry) => {
      this.currentTelemetryObject = telemetry;
    });
  }

  // onChange of Timeline Slider
  changeTimeSelection(value: number) {
    if (value) {
      this.timelineSliderValue = value;

      // Update Subscribers
      this.telemetryService.timelineEvent.emit(this.timelineSliderValue - 1);    // trigger timeline event
      this.telemetryService.currentTelemetryIdSubject.next(this.allTelemetryIdsList[value - 1]);

      // When currently playing and snap to right => we are live
      if (value === this.allTelemetryIdsList.length && this.playMode) {
        this.liveMode = true;
      }
    }
  }

  togglePlayingTrackedData() {
    this.togglePlayButton();

    if (this.playMode) {
      if (this.timelineSliderValue === this.timelineMax) {
        this.timelineSliderValue = 1;
      }
      this.playTrackedData();
    } else {
      if (this.timerSubscripton) {
        this.timerSubscripton.unsubscribe();
      }

      if (this.liveMode) {
        this.liveMode = false;
      }
    }
  }

  playTrackedData() {
    this.startTime = this.currentTelemetryObject.timestamp;
    this.curTime = this.startTime;

    this.timerObserver = TimerObservable.create(TimelineComponent.TIMER_INTERVAL, TimelineComponent.TIMER_INTERVAL);
    this.timerSubscripton = this.timerObserver.subscribe(() => {
      this.curTime += TimelineComponent.TIMER_INTERVAL;
      this.run();
    });
    this.playMode = true;
  }

  private run() {
    const nextElement = this.nextTelemetryObjects[1];
    // Can update Telemetry
    if (nextElement && nextElement.timestamp < this.curTime) {
      this.timelineSliderValue++;

      // Begin again, when in loop and at the end of the list
      if (this.loopMode && this.timelineSliderValue > this.timelineMax) {
        this.timelineSliderValue = 1;
      }
      // Stop, when not in loop and at the end of the list
      if (!this.loopMode && this.timelineSliderValue === this.timelineMax) {
        this.togglePlayButton();
      }

      // Update subscribers
      this.telemetryService.timelineEvent.emit(this.timelineSliderValue - 1);
      this.telemetryService.currentTelemetryIdSubject.next(this.allTelemetryIdsList[this.timelineSliderValue - 1]);
    }
  }

  togglePlayButton() {
    this.playMode = !this.playMode;
  }

  toggleRepeatButton() {
    this.loopMode = !this.loopMode;
  }
}
