import { Component } from '@angular/core';

@Component({
	selector: 'tch-admin',
	templateUrl: './admin.component.html',
	styleUrls: ['./admin.component.scss']
})
export class AdminComponent {
	tab = 'user';

	select(tab: string) {
		this.tab = tab;
	}
}
