import {Component} from '@angular/core';
import {EventEmitter} from 'events';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  selectedItem: string;

  constructor() {
    // EventEmitter.prototype.setMaxListeners(100);  // disable warning
  }

  onMenuSelected(menu: string) {
    this.selectedItem = menu;
  }
}
