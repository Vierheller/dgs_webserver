import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.css']
})
export class TimelineComponent implements OnInit {

  timeline: boolean;
  timeState: string;
  timelineValue: number;

  constructor() { }

  ngOnInit() {
    this.timeline = true;
    this.timeState = "Live";
    this.timelineValue = 100;
  }

  // view data for selected time
  changeTime(value) {

    // get previous data from telemetry service

    console.log(value);
  }

  get timeValue() {
    return this.timelineValue;
  }
}
