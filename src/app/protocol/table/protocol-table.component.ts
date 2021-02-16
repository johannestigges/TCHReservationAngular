import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

import { ProtocolService } from '../protocol.service';
import { Protocol } from '../protocol';
import { ErrorAware } from '../../error/error-aware';

@Component({
    selector: 'tch-protocol-table',
    templateUrl: './protocol-table.component.html',
    styleUrls: ['./protocol-table.component.css']
})
export class ProtocolTableComponent extends ErrorAware implements OnInit {

    protocols: Protocol[];

    constructor(private protocolService: ProtocolService, private location: Location) {
        super();
    }

    ngOnInit() {
        this.protocolService.getAll().subscribe(
            data => this.protocols = data,
            err => this.httpError = err
        );
    }

    cancel() {
        this.location.back();
    }
}
