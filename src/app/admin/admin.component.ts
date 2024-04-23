import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
	selector: 'tch-admin',
	templateUrl: './admin.component.html',
	styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
	constructor(private route: ActivatedRoute) { }

	tab = 'news';

	ngOnInit(): void {
		this.tab = this.route.snapshot.queryParams.tab ?? 'news';
	}

	select(tab: string) {
		this.tab = tab;
	}
}
