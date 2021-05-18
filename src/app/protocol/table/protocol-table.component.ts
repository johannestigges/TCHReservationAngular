import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

import { ProtocolService } from '../protocol.service';
import { Protocol } from '../protocol';
import { ErrorAware } from '../../error/error-aware';
import { DateUtil } from 'src/app/date/date-util';

@Component({
    selector: 'tch-protocol-table',
    templateUrl: './protocol-table.component.html',
    styleUrls: ['./protocol-table.component.css']
})
export class ProtocolTableComponent extends ErrorAware implements OnInit {

    protocols: Protocol[];
    since: number;

    constructor(private protocolService: ProtocolService, private location: Location) {
        super();
    }

    date(t: number[]) {
        return `${t[2]}.${t[1]}.${t[0]} ${t[3]}:${t[4]}`;
    }

    value(p) {
        return JSON.parse(p.value);
    }

    ngOnInit() {
        this.show( DateUtil.now() - 7 * DateUtil.DAY);
    }

    next() {
        this.show(this.since - 7 * DateUtil.DAY);
    }

    private show(since) {
        this.since = since;
        this.protocolService.getSince(this.since).subscribe(
            data => this.protocols = data,
            err => this.httpError = err
        );
    }

    cancel() {
        this.location.back();
    }
}
