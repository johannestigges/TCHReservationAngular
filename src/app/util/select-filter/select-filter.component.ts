import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';

@Component({
	selector: 'tch-select-filter',
	templateUrl: './select-filter.component.html',
})
export class SelectFilterComponent implements OnChanges {

	@Input() valueList: string[] = [];
	@Output() selected: EventEmitter<string> = new EventEmitter();

	selectableValues: string[] = [];
	selectedValue = '';
	showList = true;

	ngOnChanges() {
		this.selectableValues = [...this.valueList];
		this.selectedValue = '';
		this.showList = true;
	}

	onFilterChange(event: Event) {
		this.selectedValue = (<HTMLInputElement>event.target).value;
		this.selectableValues = this.valueList.filter(value => this.filter(value));
		this.showList = true;
		this.selected.next('');
	}

	onSelect(user: string) {
		this.selectedValue = user;
		this.selected.next(user);
		this.showList = false;
	}

	private filter(value: string): boolean {
		return !this.selectedValue
			|| value.toLowerCase().includes(this.selectedValue.toLowerCase());
	}
}
