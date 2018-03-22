import {Component, OnDestroy, ChangeDetectorRef, OnInit} from '@angular/core';
import {TelemetryService} from '../../services/telemetry.service';
import {TelemetryObject} from '../../models/objects/TelemetryObject';
import {TimerObservable} from 'rxjs/observable/TimerObservable';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import index from '@angular/cli/lib/cli';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.css']
})

export class TimelineComponent implements OnInit, OnDestroy {
  private static TIMER_INTERVAL = 1000;

  private telemetrySubscriptionIds: Subscription;
  private telemetrySubscriptionNextN: Subscription;
  private telemetrySubscriptionCurrent: Subscription;

  timelineSliderValue: number;
  timelineMax: number;
  nextTelemetryObjects: Array<TelemetryObject>;
  selectedTelemetryId: string;

  private currentTelemetryObject: TelemetryObject;

  // time for time based looping
  private startTime = 0;
  private curTime = 0;

  // States
  playMode: boolean;
  loopMode: boolean;
  liveMode: boolean;

  private allTelemetryIdsList: Array<string>;

  private timerObserver: Observable<number>;
  private timerSubscripton: Subscription;
  private isTimerRunning: boolean;

  // TimerCounter
  private currentIndexInNextTelemetryObjects: number;
  private myCurrentTelemetryId: BehaviorSubject<string>;

  private lookupSize: BehaviorSubject<number> = new BehaviorSubject(20);

  constructor(private ref: ChangeDetectorRef, private telemetryService: TelemetryService) {
    this.allTelemetryIdsList = [];
  }

  ngOnInit() {
    this.playMode = true;
    this.loopMode = false;
    this.liveMode = true;
    this.isTimerRunning = false;

    this.myCurrentTelemetryId = new BehaviorSubject<string>('');
    this.nextTelemetryObjects = [];

    this.telemetrySubscriptionIds = this.telemetryService.getTelemetryIdsObservable().subscribe((telemetryIds) => {
      this.allTelemetryIdsList = telemetryIds;

      // Automatic Mode
      if (this.playMode && this.liveMode) { // auto update list
        this.timelineSliderValue = telemetryIds.length;
        this.selectedTelemetryId = telemetryIds[telemetryIds.length - 1];

        this.updateSubscribers(telemetryIds[telemetryIds.length - 1]);
      }
      this.timelineMax = telemetryIds.length;
      this.ref.detectChanges();
    });

    this.telemetrySubscriptionNextN =
      this.telemetryService.getNextNTelemetry(this.myCurrentTelemetryId, this.lookupSize)
      .subscribe((nextTelemetryObjects) => {
      this.nextTelemetryObjects = nextTelemetryObjects;
    });

    this.telemetrySubscriptionCurrent = this.telemetryService.getTelemetryForCurrentId().subscribe((telemetry) => {
      this.currentTelemetryObject = telemetry;
    });
  }

  ngOnDestroy() {
    this.telemetrySubscriptionIds.unsubscribe();
    this.telemetrySubscriptionNextN.unsubscribe();
    this.telemetrySubscriptionCurrent.unsubscribe();
  }

  // Let go of slider
  onChange(value: number) {
    this.myCurrentTelemetryId.next(this.allTelemetryIdsList[value - 1]);
    this.startTime = this.currentTelemetryObject.timestamp;
    this.curTime = this.startTime;
  }

  // onChange of Timeline Slider
  changeTimeSelection(value: number) {
    if (value) {
      this.timelineSliderValue = value;

      this.updateSubscribers(this.allTelemetryIdsList[value - 1]);

      this.startTime = this.currentTelemetryObject.timestamp;
      this.curTime = this.startTime;

      // When currently playing and snap to right => we are live
      // == is okay, === doesn't work -- javascript shenanigans
      if (this.playMode && (value == this.allTelemetryIdsList.length)) {
        console.log('Live');
        this.liveMode = true;
      } else {
        this.liveMode = false;
        if (!this.isTimerRunning) {
          this.playTrackedData();
        }
      }
    }
  }

  // Publish current selection to service
  private updateSubscribers(id) {
    this.telemetryService.currentTelemetryIdSubject.next(id);
  }

  // Play Button clicked
  togglePlayingTrackedData() {
    this.togglePlayButton();

    if (this.playMode) {
      if (this.timelineSliderValue === this.timelineMax) {
        this.timelineSliderValue = 1;
      }
      this.playTrackedData();
    } else {
      if (this.isTimerRunning) {
        this.stopTrackedData();
      }

      if (this.liveMode) {
        this.liveMode = false;
      }
    }
  }


  // Start time based sliding
  playTrackedData() {
    this.startTime = this.currentTelemetryObject.timestamp;
    this.curTime = this.startTime;
    this.isTimerRunning = true;
    this.currentIndexInNextTelemetryObjects = 1;

    let currentTime = new Date().getTime();
    this.timerObserver = TimerObservable.create(TimelineComponent.TIMER_INTERVAL, TimelineComponent.TIMER_INTERVAL);
    this.timerSubscripton = this.timerObserver.subscribe(() => {
      this.isTimerRunning = true;
      const newTime = new Date().getTime();
      this.curTime += newTime - currentTime;
      currentTime = newTime;
      this.run();
    });
    this.playMode = true;
  }

  // Stop time based sliding
  private stopTrackedData() {
    this.timerSubscripton.unsubscribe();
    this.isTimerRunning = false;
  }

  // Executed on Tick of Timer
  private run() {
    // There is no next element
    if (this.nextTelemetryObjects.length < 2) {
      return;
    }

    const nextIndex = this.findNextElementIndex(this.nextTelemetryObjects, this.curTime);
    console.log("NextIndex: "+ nextIndex);
    // Can update Telemetry
    if (nextIndex > this.currentIndexInNextTelemetryObjects) {
      this.currentIndexInNextTelemetryObjects = nextIndex;
      const nextElement = this.nextTelemetryObjects[nextIndex];
      this.currentIndexInNextTelemetryObjects++;
      this.timelineSliderValue++;

      // Begin again, when in loop and at the end of the list
      if (this.loopMode && this.timelineSliderValue > this.timelineMax) {
        this.timelineSliderValue = 1;
      }
      // Stop, when not in loop and at the end of the list
      if (!this.loopMode && this.timelineSliderValue === this.timelineMax) {
        this.togglePlayButton();
      }

      if (this.currentIndexInNextTelemetryObjects === this.nextTelemetryObjects.length - 1) {
        this.currentIndexInNextTelemetryObjects = 1;
        this.myCurrentTelemetryId.next(this.allTelemetryIdsList[this.timelineSliderValue - 1]);
      }
      this.updateSubscribers(this.allTelemetryIdsList[this.timelineSliderValue - 1]);
    }
  }

  /**
   * find the telemetry that fits closest to current time
   * curTime: 10
   * times are : 4,5,6,7,7,8,9,10,10,11,12,13,14 -> second 10
   *
   * @param {Array<TelemetryObject>} telemetries
   * @param currentTime
   * @returns {number}
   */
  private findNextElementIndex(telemetries: Array<TelemetryObject>, currentTime: number) {
    let closestIndex = this.currentIndexInNextTelemetryObjects;
    telemetries.forEach((value, index) => {
      if (value.timestamp < currentTime) {
        closestIndex = index;
      }
    });
    return closestIndex;
  }

  // UI help and state
  togglePlayButton() {
    this.playMode = !this.playMode;
  }

  // UI help and state
  toggleRepeatButton() {
    this.loopMode = !this.loopMode;
  }
}
