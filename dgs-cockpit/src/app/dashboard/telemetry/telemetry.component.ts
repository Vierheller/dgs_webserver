import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from "@angular/material";
import { TelemetryService } from "../../services/telemetry.service";

@Component({
  selector: 'app-telemetry',
  templateUrl: './telemetry.component.html',
  styleUrls: ['./telemetry.component.css']
})
export class TelemetryComponent implements OnInit {
  displayedColumns = ['parameter', 'value'];
  dataSource = new MatTableDataSource<Element>(telemetricData);

  constructor(private telemetrieServ:TelemetryService) { }

  ngOnInit() {
  }

}

export interface Element {
  value: string;
  parameter: string;
}

const telemetricData: Element[] = [
  {parameter: 'Koordinaten', value: '49° 29\' 14.853" N 8° 27\' 57.742" E '},
  {parameter: 'Temperatur PI Board', value: '41 °C'},
  {parameter: 'Lora Frequenz', value: '868 MHz'},
  {parameter: 'Übertragungsfehler', value: '34'},
  {parameter: 'Anzahl der Pakete', value: '3.842'},
];
