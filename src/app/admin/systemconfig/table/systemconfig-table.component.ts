import {Component, OnDestroy, OnInit} from '@angular/core';

import {ErrorAware} from '../../../util/error/error-aware';
import {ReservationSystemConfig} from 'src/app/reservation/reservation-system-config';
import {SystemconfigService} from '../systemconfig.service';
import {Router, RouterLink} from '@angular/router';

import {ShowErrorComponent} from "../../../util/show-error/show-error.component";
import {Subject, takeUntil} from 'rxjs';

@Component({
  selector: 'tch-systemconfig-table',
  templateUrl: './systemconfig-table.component.html',
  styleUrls: ['./systemconfig-table.component.scss'],
  imports: [RouterLink, ShowErrorComponent]
})
export class SystemconfigTableComponent extends ErrorAware implements OnInit, OnDestroy {

  systemconfigs: ReservationSystemConfig[] = [];

  private readonly destroy$ = new Subject<void>();

  constructor(
    private systemconfigService: SystemconfigService,
    private router: Router) {
    super();
  }

  ngOnInit() {
    this.systemconfigService.getAll().pipe(takeUntil(this.destroy$)).subscribe({
      next: (data) => this.systemconfigs = data,
      error: (error) => this.setError(error)
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  cancel() {
    this.router.navigateByUrl('/');
  }
}
