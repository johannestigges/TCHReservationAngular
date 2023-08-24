import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

import { ErrorAware } from '../../../util/error/error-aware';
import { ReservationSystemConfig } from 'src/app/reservation/reservation-system-config';
import { SystemconfigService } from '../systemconfig.service';
import {
	UntypedFormArray,
	UntypedFormBuilder,
	UntypedFormControl,
	UntypedFormGroup,
	Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

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

	form: UntypedFormGroup;

	constructor(
    private location: Location,
    private route: ActivatedRoute,
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

		const id = this.route.snapshot.params.id;
		this.systemconfigService.get(id).subscribe(
			(data) => {
				this.form.get('id').setValue(data.id);
				this.form.get('name').setValue(data.name);
				this.form.get('title').setValue(data.title);
				for (const court of data.courts) {
					this.add(court);
				}
				this.form
					.get('durationUnitInMinutes')
					.setValue(data.durationUnitInMinutes);
				this.form
					.get('maxDaysReservationInFuture')
					.setValue(data.maxDaysReservationInFuture);
				this.form.get('maxDuration').setValue(data.maxDuration);
				this.form.get('openingHour').setValue(data.openingHour);
				this.form.get('closingHour').setValue(data.closingHour);
			},
			(error) => (this.httpError = error)
		);
	}

	createCourt(): UntypedFormGroup {
		return this.formBuilder.group({
			court: '',
		});
	}

	add(court: string): void {
		this.getCourts().push(new UntypedFormControl(court));
	}

	addCourt(): void {
		this.add('');
	}

	getCourts(): UntypedFormArray {
		return this.form.get('courts') as UntypedFormArray;
	}

	removeCourt(i: number): void {
		this.getCourts().removeAt(i);
	}

	delete() {
		this.clearError();

		this.systemconfigService.delete(this.form.get('id').value).subscribe(
			(data) => {
				alert(`Systemkonfiguration ${data.name} wurde gelöscht.`);
				this.cancel();
			},
			(error) => (this.httpError = error)
		);
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

		this.systemconfigService.update(newconfig).subscribe(
			(data) => {
				alert(`Systemkonfiguration ${data.name} wurde geändert.`);
				this.cancel();
			},
			(err) => (this.httpError = err)
		);
	}

	cancel() {
		this.location.back();
	}
}
