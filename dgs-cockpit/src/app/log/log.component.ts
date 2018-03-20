import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, OnDestroy} from '@angular/core';
import { LogService } from '../services/log.service';
import { Log } from '../models/Log';
import {Observable} from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/observable/combineLatest';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-log',
  templateUrl: './log.component.html',
  styleUrls: ['./log.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LogComponent implements OnInit, OnDestroy {
  public logList: Log[];
  private subscription: Subscription;
  page: BehaviorSubject<number> = new BehaviorSubject(1);
  private countPerPage: BehaviorSubject<number> = new BehaviorSubject(20);

  private currentObserver: Observable<Array<Log>>;

  constructor(private ref: ChangeDetectorRef, public logService: LogService) {
    this.logList = [];
  }

  ngOnInit() {
    this.loadLogs();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  loadLogs() {
    this.subscription = this.logService.getLogs(this.page, this.countPerPage).subscribe((logs: Log[]) => {
        this.logList = logs;
        console.log('Updated my list');
        this.ref.detectChanges();
      });
  }

  nextPage() {
    const next = this.page.getValue() + 1;
    this.page.next(next);
  }

  prevPage() {
    if (this.page.getValue() > 1) {
      const prev = this.page.getValue() - 1;
      this.page.next(prev);
    }
  }

}
