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
	showList = false;

	ngOnChanges() {
		this.selectableValues = [...this.valueList];
		this.selectedValue = '';
	}

	onInput(event: Event) {
		this.selectedValue = (<HTMLInputElement>event.target).value;
		this.selectableValues = this.valueList.filter(value => this.filter(value));
		this.selected.next('');
		this.showList = true;
	}

	onFocus() {
		this.showList = true;
	}

	onSelect(value: string) {
		this.selectedValue = value;
		this.selected.next(value);
		this.showList = false;
	}

	private filter(value: string): boolean {
		return !this.selectedValue
			|| value.toLowerCase().includes(this.selectedValue.toLowerCase());
	}
}
