import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ReservationSystemConfig } from 'src/app/reservation/reservation-system-config';
import { SystemconfigService } from '../systemconfig.service';
import {
	UntypedFormArray,
	UntypedFormBuilder,
	UntypedFormControl,
	UntypedFormGroup,
	Validators,
} from '@angular/forms';
import { ErrorAware } from 'src/app/util/error/error-aware';

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

	form: UntypedFormGroup;

	constructor(
    private location: Location,
    private formBuilder: UntypedFormBuilder,
    private systemconfigService: SystemconfigService
	) {
		super();
	}

	ngOnInit() {
		this.form = this.formBuilder.group({
			id: new UntypedFormControl('', Validators.required),
			name: new UntypedFormControl('', Validators.required),
			title: new UntypedFormControl(''),
			courts: new UntypedFormArray([]),
			durationUnitInMinutes: new UntypedFormControl('', Validators.required),
			maxDaysReservationInFuture: new UntypedFormControl(
				'',
				Validators.required
			),
			maxDuration: new UntypedFormControl('', Validators.required),
			openingHour: new UntypedFormControl('', Validators.required),
			closingHour: new UntypedFormControl('', Validators.required),
		});

		this.form.get('id').setValue(1);
		this.addCourt();
		this.form.get('durationUnitInMinutes').setValue(60);
		this.form.get('maxDaysReservationInFuture').setValue(1);
		this.form.get('maxDuration').setValue(1);
		this.form.get('openingHour').setValue(8);
		this.form.get('closingHour').setValue(22);
	}

	createCourt(): UntypedFormGroup {
		return this.formBuilder.group({
			court: '',
		});
	}

	addCourt(): void {
		this.getCourts().push(new UntypedFormControl(''));
	}

	removeCourt(i: number): void {
		this.getCourts().removeAt(i);
	}

	getCourts(): UntypedFormArray {
		return this.form.get('courts') as UntypedFormArray;
	}

	onClick() {
		this.clearError();

		const newconfig = new ReservationSystemConfig(
			this.form.get('id').value,
			this.form.get('name').value,
			this.form.get('title').value,
			this.form.get('courts').value,
			this.form.get('durationUnitInMinutes').value,
			this.form.get('maxDaysReservationInFuture').value,
			this.form.get('maxDuration').value,
			this.form.get('openingHour').value,
			this.form.get('closingHour').value
		);
		this.systemconfigService.add(newconfig).subscribe(
			() => this.cancel(),
			(err) => (this.httpError = err)
		);
	}
	cancel() {
		this.location.back();
	}
}
