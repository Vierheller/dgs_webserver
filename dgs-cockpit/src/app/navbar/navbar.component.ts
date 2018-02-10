import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})

export class NavbarComponent implements OnInit {

  selectedItem: string;

  constructor() { }

  ngOnInit() {
    this.selectedItem = 'dashboard';
  }
}
