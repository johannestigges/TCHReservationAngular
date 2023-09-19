import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ReservationTypeForm, ReservationTypeValues, createReservationTypeForm } from '../systemconfig-form';
import { UserRole, userRoleNames, userRoleValues } from '../../user/user-role.enum';
import { IDropdownSettings } from 'ng-multiselect-dropdown';

@Component({
	selector: 'tch-reservation-type',
	templateUrl: './reservation-type.component.html',
	styleUrls: ['./reservation-type.component.scss']
})
export class ReservationTypeComponent implements OnInit {
	@Input() value?: ReservationTypeValues;
	form: FormGroup<ReservationTypeForm> | null = null;

	readonly maxDays = [0, 1, 2, 3, 4, 5, 6, 7, 14, 21, 31, 62, 365];
	readonly maxCancel = [0,1,2,3,4,5,6,7,8];
	readonly maxDurations = [
		0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
	];

	userRoleNames = userRoleNames;

	ngOnInit(): void {
		this.form = createReservationTypeForm();
		if (this.value) {
			this.form.setValue(this.value);
		}
	}
	@Output() finished = new EventEmitter<FormGroup<ReservationTypeForm> | null>();

	onSubmit() {

		this.finished.emit(this.form);
	}
	onCancel() { this.finished.emit(null);}
}
