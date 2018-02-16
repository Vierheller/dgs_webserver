import {Component, OnInit} from '@angular/core';
import {selectValueAccessor} from '@angular/forms/src/directives/shared';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';

  selectedItem: string;

  onMenuSelected(menu: string) {
    this.selectedItem = menu;
  }


}
