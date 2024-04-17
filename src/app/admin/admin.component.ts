import { Component } from '@angular/core';

@Component({
	selector: 'tch-admin',
	templateUrl: './admin.component.html',
	styleUrls: ['./admin.component.scss']
})
export class AdminComponent {
	tab = 'news';

	select(tab: string) {
		this.tab = tab;
	}
}
