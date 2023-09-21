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
	readonly NOT_IN_EDIT = -1;

	@Input() form!: FormArray<FormGroup<ReservationTypeForm>>;

	inEdit = this.NOT_IN_EDIT;

	onStartEdit(i: number) {
		this.inEdit = i;
	}

	onRemove(i: number) {
		this.form.removeAt(i);
	}

	onFinishedReservationType(form: FormGroup<ReservationTypeForm>) {
		if (form) {
			this.form.setControl(this.inEdit, form);
		}
		this.inEdit = this.NOT_IN_EDIT;
	}

	getRoles(roles: FormArray<FormControl<boolean>>): string {
		return userRoleValues
			.map((role, index) => roles.at(index).value ? userRoleNames[index] : null)
			.filter(role => role)
			.join(', ');
	}
}
