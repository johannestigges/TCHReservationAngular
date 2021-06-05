import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'tch-admin',
    templateUrl: './admin.component.html',
    styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
    tab: string;
    ngOnInit() {
        this.select('user');
    }

    select(tab: string) {
        this.tab = tab;
    }
}
