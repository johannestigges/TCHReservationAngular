import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

import { ErrorAware } from '../../../util/error/error-aware';
import { ReservationSystemConfig } from 'src/app/reservation/reservation-system-config';
import { SystemconfigService } from '../systemconfig.service';

@Component({
  selector: 'tch-systemconfig-table',
  templateUrl: './systemconfig-table.component.html',
  styleUrls: ['./systemconfig-table.component.scss']
})
export class SystemconfigTableComponent extends ErrorAware implements OnInit {

  systemconfigs: ReservationSystemConfig[];

  constructor(
    private systemconfigService: SystemconfigService,
    private location: Location) {
    super();
  }

  ngOnInit() {
    this.systemconfigService.getAll().subscribe(
      data => this.systemconfigs = data,
      err => this.httpError = err
    );
  }

  cancel() {
    this.location.back();
  }
}
