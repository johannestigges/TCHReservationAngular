import { Component, Input } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { ReservationTypeForm } from '../systemconfig-form';
import { userRoleNames, userRoleValues } from '../../user/user-role.enum';

@Component({
	selector: 'tch-reservation-types',
	templateUrl: './reservation-types.component.html',
	styleUrls: ['./reservation-types.component.scss']
})
export class ReservationTypesComponent {
	readonly NO_RESERVATION_IN_EDIT = -1

	@Input() form!: FormArray<FormGroup<ReservationTypeForm>>;

	reservationTypeInEdit = this.NO_RESERVATION_IN_EDIT;

	onAddType() {
		this.reservationTypeInEdit = this.form.length + 1;
	}
	onEditType(i: number) {
		this.reservationTypeInEdit = i;
	}
	onRemoveType(i: number) {
		this.form.removeAt(i);
	}
	onFinishedReservationType(form: FormGroup<ReservationTypeForm>) {
		if (form) {
			this.form.setControl(this.reservationTypeInEdit, form);
		}
		this.reservationTypeInEdit = this.NO_RESERVATION_IN_EDIT;
	}

	getRoles(roles: FormArray<FormControl<boolean>>): string {
		return userRoleValues
			.map((role, index) => roles.at(index).value ? userRoleNames[index] : null)
			.filter(role => role)
			.join(', ');
	}
	getValues(form:FormGroup<ReservationTypeForm>) {
		const c=this.form.controls
		return form.getRawValue();
	}
}
