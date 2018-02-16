import {Component, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})

export class NavbarComponent  implements OnInit {
  @Output() selectMenu = new EventEmitter<string>();

  selectedItem: string;

  constructor() { }

  ngOnInit() {
    this.selectItem('dashboard');
  }

  selectItem(selectedItem: string) {
    this.selectMenu.emit(selectedItem);
    this.selectedItem = selectedItem;
  }
}
