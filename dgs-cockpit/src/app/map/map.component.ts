import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
// tslint:disable-next-line:max-line-length
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  public zoom = 15;
  public opacity = 1.0;
  public width = 5;

  increaseZoom() {
      this.zoom  = Math.min(this.zoom + 1, 18);
      console.log('zoom: ', this.zoom);
  }

  decreaseZoom() {
      this.zoom  = Math.max(this.zoom - 1, 1);
      console.log('zoom: ', this.zoom);
  }

  increaseOpacity() {
      this.opacity  = Math.min(this.opacity + 0.1, 1);
      console.log('opacity: ', this.opacity);
  }

  decreaseOpacity() {
      this.opacity  = Math.max(this.opacity - 0.1, 0);
      console.log('opacity: ', this.opacity);
  }
  // tslint:disable-next-line:max-line-length
  constructor() {

  }

  ngOnInit() {

  }

  // tslint:disable-next-line:use-life-cycle-interface
  ngAfterViewInit() {

  }

  onClickMe() {
  }

}
