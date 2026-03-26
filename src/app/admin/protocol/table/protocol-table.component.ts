import {Component, OnDestroy, OnInit} from '@angular/core';

import {ProtocolService} from '../protocol.service';
import {Protocol} from '../protocol';
import {ErrorAware} from '../../../util/error/error-aware';
import {DateUtil} from '../../../util/date/date-util';
import {Router} from '@angular/router';
import { KeyValuePipe } from "@angular/common";
import {ShowErrorComponent} from "../../../util/show-error/show-error.component";
import {Subject, takeUntil} from 'rxjs';

@Component({
  selector: 'tch-protocol-table',
  templateUrl: './protocol-table.component.html',
  imports: [KeyValuePipe, ShowErrorComponent]
})
export class ProtocolTableComponent extends ErrorAware implements OnInit, OnDestroy {

  protocols: Protocol[] = [];
  since = 0;

  private readonly destroy$ = new Subject<void>();

  constructor(private protocolService: ProtocolService, private router: Router) {
    super();
  }

  ngOnInit() {
    this.since = DateUtil.now();
    this.next();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  next() {
    this.show(this.since - 7 * DateUtil.DAY);
  }

  private show(since: number) {
    this.since = since;
    this.protocolService.getSince(this.since).pipe(takeUntil(this.destroy$)).subscribe({
      next: (data) => this.protocols = data,
      error: (error) => this.setError(error)
    });
  }

  date(t: number) {
    return DateUtil.showDateTime(t);
  }

  parseJson(o: string) {
    return JSON.parse(o);
  }

  cancel() {
    this.router.navigateByUrl('/');
  }
}
