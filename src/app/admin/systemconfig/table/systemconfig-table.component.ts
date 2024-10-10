import { Component, OnInit } from '@angular/core';

import { ErrorAware } from '../../../util/error/error-aware';
import { ReservationSystemConfig } from 'src/app/reservation/reservation-system-config';
import { SystemconfigService } from '../systemconfig.service';
import { Router } from '@angular/router';

@Component({
	selector: 'tch-systemconfig-table',
	templateUrl: './systemconfig-table.component.html',
	styleUrls: ['./systemconfig-table.component.scss']
})
export class SystemconfigTableComponent extends ErrorAware implements OnInit {

	systemconfigs: ReservationSystemConfig[] = [];

	constructor(
		private systemconfigService: SystemconfigService,
		private router: Router) {
		super();
	}

	ngOnInit() {
		this.systemconfigService.getAll().subscribe({
			next: (data) => this.systemconfigs = data,
			error: (error) => this.setError(error)
		});
	}

	cancel() {
		this.router.navigateByUrl('/');
	}
}
