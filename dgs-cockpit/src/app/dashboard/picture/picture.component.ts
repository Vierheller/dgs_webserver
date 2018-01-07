import { Component, OnInit } from '@angular/core';
import {MatTableDataSource} from "@angular/material";

@Component({
  selector: 'app-picture',
  templateUrl: './picture.component.html',
  styleUrls: ['./picture.component.css']
})
export class PictureComponent implements OnInit {

  displayedColumns = ['parameter', 'value'];
  dataSource = new MatTableDataSource<Element>(ELEMENT_DATA);

  constructor() { }

  ngOnInit() {
  }

}
export interface Element {
  value: string;
  parameter: string;
}

const ELEMENT_DATA: Element[] = [
  {parameter: 'Höhe', value: '11.324 m'},
  {parameter: 'Geschwindigkeit (über Grund)', value: '48 km/h'},
  {parameter: 'Steigen', value: '5,3 m/s'},
];
