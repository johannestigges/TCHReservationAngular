import { Component, OnInit } from '@angular/core';
import { ErrorAware } from '../../../util/error/error-aware';
import { ReservationSystemConfig, SystemConfigReservationType } from 'src/app/reservation/reservation-system-config';
import { SystemconfigService } from '../systemconfig.service';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SystemconfigForm, createReservationTypeForm, createSystemConfigForm } from '../systemconfig-form';
import { userRoleValues } from '../../user/user-role.enum';

@Component({
	selector: 'tch-systemconfig-modify',
	templateUrl: './systemconfig-modify.component.html',
	styleUrls: ['./systemconfig-modify.component.scss'],
})
export class SystemconfigModifyComponent extends ErrorAware implements OnInit {
	durationUnits = [30, 60];
	maxDays = [1, 2, 3, 4, 5, 6, 7, 14, 21, 31, 62, 365];
	maxDurations = [
		1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
	];
	openingHours = [
		0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
		21, 22, 23, 24,
	];
	closingHours = [
		7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 1, 2,
		3, 4, 5, 6,
	];

	form: FormGroup<SystemconfigForm>;

	constructor(
		private router:Router,
		private route: ActivatedRoute,
		private systemconfigService: SystemconfigService
	) {
		super();
		this.form = createSystemConfigForm();
	}

	ngOnInit() {
		const id = this.route.snapshot.params.id;
		this.systemconfigService.get(id).subscribe({
			next: (data) => {
				this.form.controls.id.setValue(data.id);
				this.form.controls.name.setValue(data.name);
				this.form.controls.title.setValue(data.title);
				for (const court of data.courts) {
					this.add(court);
				}
				this.form.controls.durationUnitInMinutes
					.setValue(data.durationUnitInMinutes);
				this.form.controls.maxDaysReservationInFuture
					.setValue(data.maxDaysReservationInFuture);
				this.form.controls.maxDuration.setValue(data.maxDuration);
				this.form.controls.openingHour.setValue(data.openingHour);
				this.form.controls.closingHour.setValue(data.closingHour);
				this.form.controls.types.clear();
				for (const type of data.types) {
					this.form.controls.types.push(this.initType(type));
				}
			},
			error: (error) => this.setError(error)
		});
	}


	private initType(type: SystemConfigReservationType) {
		const form = createReservationTypeForm();
		form.controls.id.setValue(type.type);
		form.controls.name.setValue(type.name);
		form.controls.maxDuration.setValue(type.maxDuration);
		form.controls.maxDaysReservationInFuture.setValue(type.maxDaysReservationInFuture);
		form.controls.maxCancelInHours.setValue(type.maxCancelInHours);
		form.controls.repeatable.setValue(type.repeatable);
		form.controls.publicVisible.setValue(type.publicVisible);
		for (let i = 0; i < userRoleValues.length; i++) {
			form.controls.roles.at(i).setValue(type.roles.includes(userRoleValues[i]));
		}
		return form;
	}

	add(court: string): void {
		this.courts.controls.push(new FormControl(court) as FormControl<string>);
	}

	addCourt(): void {
		this.add('');
	}

	get courts(): FormArray<FormControl<string>> {
		return this.form.controls.courts;
	}

	removeCourt(i: number): void {
		this.courts.removeAt(i);
	}

	onDelete() {
		this.clearError();

		this.systemconfigService.delete(this.form.controls.id.value).subscribe({
			next: (data) => {
				alert(`Systemkonfiguration ${data.name} wurde gelöscht.`);
				this.onCancel();
			},
			error: (error) => this.setError(error)
		});
	}

	onSubmit() {
		this.clearError();

		const newconfig = new ReservationSystemConfig(
			this.form.controls.id.value,
			this.form.controls.name.value,
			this.form.controls.title.value,
			this.form.controls.courts.controls.filter(c => c.value).map(c => c.value),
			this.form.controls.durationUnitInMinutes.value,
			this.form.controls.maxDaysReservationInFuture.value,
			this.form.controls.maxDuration.value,
			this.form.controls.openingHour.value,
			this.form.controls.closingHour.value,
			this.getTypesFromForm()
		);

		this.systemconfigService.update(newconfig).subscribe({
			next: (data) => {
				alert(`Systemkonfiguration ${data.name} wurde geändert.`);
				this.onCancel();
			},
			error: (error) => this.setError(error)
		});
	}

	onCancel() {
		this.router.navigateByUrl('admin?tab=systemconfig');
	}

	private getTypesFromForm() {
		const types: SystemConfigReservationType[] = [];
		this.form.controls.types.controls.forEach(type =>
			types.push({
				id: 0,
				type: type.controls.id.value,
				name: type.controls.name.value,
				maxDuration: type.controls.maxDuration.value,
				maxDaysReservationInFuture: type.controls.maxDaysReservationInFuture.value,
				maxCancelInHours: type.controls.maxCancelInHours.value,
				repeatable: type.controls.repeatable.value,
				publicVisible: type.controls.publicVisible.value,
				roles: this.getRolesFromForm(type.controls.roles)
			})
		);
		return types;
	}
	private getRolesFromForm(form: FormArray<FormControl<boolean>>) {
		const roles: string[] = [];
		for (let i = 0; i < userRoleValues.length; i++) {
			if (form.at(i).value) {
				roles.push(userRoleValues[i]);
			}
		}
		return roles;
	}
}
