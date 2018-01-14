import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { TelemetryService } from '../../services/telemetry.service';
import { TelemetryInternal } from '../../models/Telemetry';

@Component({
  selector: 'app-telemetry',
  templateUrl: './telemetry.component.html',
  styleUrls: ['./telemetry.component.css']
})
export class TelemetryComponent implements OnInit {
  lastTelemetry: TelemetryInternal;
  displayedColumns = ['parameter', 'value'];
  dataSource = new MatTableDataSource<Element>(telemetricData);

  constructor(private telemetrieService: TelemetryService) {
   }

  ngOnInit() {
    this.telemetrieService.getData().subscribe((data) => {
      console.log('COMPONENT DATA: ' + data[0]);
      this.telemetrieService.getTelemetryById(data[data.length - 1])
          .then((tele) => {
            this.lastTelemetry = tele;
            this.convertTelemetryToElement();
          });
      });
  }

  convertTelemetryToElement() {
    const tempArray = new Array<Element>();
    for (const p in this.lastTelemetry) {
      if (this.lastTelemetry.hasOwnProperty(p) ) {
         tempArray.push({parameter: p, value: this.lastTelemetry[p]});
      }
    }
    this.dataSource = new MatTableDataSource<Element>(tempArray);
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
