import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

import { ProtocolService } from '../protocol.service';
import { Protocol } from '../protocol';
import { ErrorAware } from '../../../util/error/error-aware';
import { DateUtil } from '../../../util/date/date-util';

@Component({
	selector: 'tch-protocol-table',
	templateUrl: './protocol-table.component.html',
	styleUrls: ['./protocol-table.component.scss']
})
export class ProtocolTableComponent extends ErrorAware implements OnInit {

	protocols: Protocol[] = [];
	since = 0;

	constructor(private protocolService: ProtocolService, private location: Location) {
		super();
	}

	ngOnInit() {
		this.since = DateUtil.now();
		this.next();
	}

	next() {
		this.show(this.since - 7 * DateUtil.DAY);
	}

	private show(since: number) {
		this.since = since;
		this.protocolService.getSince(this.since).subscribe({
			next: (data) => this.protocols = data,
			error: (error) => this.setError(error)
		});
	}

	date(t: number[]) {
		return `${t[2]}.${t[1]}.${t[0]} ${t[3]}:${t[4]}`;
	}

	parseJson(o: string) {
		return JSON.parse(o);
	}

	cancel() {
		this.location.back();
	}
}
