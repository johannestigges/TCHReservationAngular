import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormArray, FormControl, FormGroup, FormGroupDirective } from '@angular/forms';
import { ReservationTypeForm } from '../systemconfig-form';
import { userRoleNames, userRoleValues } from '../../user/user-role.enum';

@Component({
	selector: 'tch-reservation-types',
	templateUrl: './reservation-types.component.html',
	styleUrls: ['./reservation-types.component.scss']
})
export class ReservationTypesComponent implements OnInit {
	readonly NOT_IN_EDIT = -1;

	form?: FormArray;
	@Input() formGroupName = '';

	inEdit = this.NOT_IN_EDIT;

	constructor(private formGroupDirective: FormGroupDirective) {
	}

	ngOnInit(): void {
		this.form = this.formGroupDirective.control.get(this.formGroupName) as FormArray;
	}

	onStartEdit(i: number) {
		this.inEdit = i;
	}

	onRemove(i: number) {
		this.form?.removeAt(i);
	}

	onFinishedReservationType(form: FormGroup<ReservationTypeForm>) {
		if (form) {
			this.form?.setControl(this.inEdit, form);
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
