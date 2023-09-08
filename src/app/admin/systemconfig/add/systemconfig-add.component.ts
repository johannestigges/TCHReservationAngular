import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ReservationSystemConfig } from 'src/app/reservation/reservation-system-config';
import { SystemconfigService } from '../systemconfig.service';
import { FormArray,	FormControl, FormGroup } from '@angular/forms';
import { ErrorAware } from 'src/app/util/error/error-aware';
import { SystemconfigForm, createSystemConfigForm } from '../systemconfig-form';

@Component({
	selector: 'tch-systemconfig-add',
	templateUrl: './systemconfig-add.component.html',
	styleUrls: ['./systemconfig-add.component.scss'],
})
export class SystemconfigAddComponent extends ErrorAware implements OnInit {
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
		private location: Location,
		private systemconfigService: SystemconfigService
	) {
		super();
	}

	ngOnInit() {
		this.form = createSystemConfigForm();

		this.form.controls.id.setValue(1);
		this.addCourt();
		this.form.controls.durationUnitInMinutes.setValue(60);
		this.form.controls.maxDaysReservationInFuture.setValue(1);
		this.form.controls.maxDuration.setValue(1);
		this.form.controls.openingHour.setValue(8);
		this.form.controls.closingHour.setValue(22);
	}

	addCourt(): void {
		this.courts.controls.push(new FormControl(''));
	}

	removeCourt(i: number): void {
		this.courts.removeAt(i);
	}

	get courts(): FormArray<FormControl<string>> {
		return this.form.controls.courts;
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
			[]
		);
		this.systemconfigService.add(newconfig).subscribe({
			next: () => this.onCancel(),
			error: (error) => this.setError(error)
		});
	}
	onCancel() {
		this.location.back();
	}
}
