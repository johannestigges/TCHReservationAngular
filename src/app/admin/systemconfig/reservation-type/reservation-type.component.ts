import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {FormGroup, ReactiveFormsModule} from '@angular/forms';
import { ReservationTypeForm, ReservationTypeValues, createReservationTypeForm } from '../systemconfig-form';
import { userRoleNames } from '../../user/user-role.enum';
import { weekDaysNames } from 'src/app/reservation/week-days';
import {NgFor, NgIf} from "@angular/common";

@Component({
    selector: 'tch-reservation-type',
    templateUrl: './reservation-type.component.html',
    imports:[NgIf,NgFor,ReactiveFormsModule],
})
export class ReservationTypeComponent implements OnInit {
	@Input() value?: ReservationTypeValues;
	@Output() finished = new EventEmitter<FormGroup<ReservationTypeForm> | null>();

	form: FormGroup<ReservationTypeForm> | null = null;

	readonly maxDays = [0, 1, 2, 3, 4, 5, 6, 7, 14, 21, 31, 62, 365];
	readonly maxCancel = [0, 1, 2, 3, 4, 5, 6, 7, 8];
	readonly maxDurations = [
		0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20
	];

	readonly userRoleNames = userRoleNames;
	readonly weekDaysNames = weekDaysNames;

	ngOnInit(): void {
		this.form = createReservationTypeForm();
		if (this.value) {
			this.form.setValue(this.value);
		}
	}

	onSubmit() {
		this.finished.emit(this.form);
	}

	onCancel() {
		this.finished.emit(null);
	}
}
