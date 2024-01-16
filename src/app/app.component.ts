import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { SystemconfigService } from './admin/systemconfig/systemconfig.service';

@Component({
	selector: 'tch-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
	constructor(private title: Title, private service: SystemconfigService) {}

	ngOnInit(): void {
		this.service.get(1).subscribe((props) => this.title.setTitle(props.title));
	}
}
