import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ErrorAware } from '../../../util/error/error-aware';
import { ReservationSystemConfig } from 'src/app/reservation/reservation-system-config';
import { SystemconfigService } from '../systemconfig.service';
import { FormArray,	FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { SystemconfigForm, createSystemConfigForm } from '../systemconfig-form';

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
		private location: Location,
		private route: ActivatedRoute,
		private systemconfigService: SystemconfigService
	) {
		super();
	}

	ngOnInit() {
		this.form = createSystemConfigForm(); 

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
			},
			error: (error) => this.setError(error)
		});
	}


	add(court: string): void {
		this.courts.controls.push(new FormControl(court));
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

	delete() {
		this.clearError();

		this.systemconfigService.delete(this.form.get('id').value).subscribe({
			next: (data) => {
				alert(`Systemkonfiguration ${data.name} wurde gelöscht.`);
				this.cancel();
			},
			error: (error) => this.setError(error)
		});
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
			this.form.get('closingHour').value,
			[]
		);

		this.systemconfigService.update(newconfig).subscribe({
			next: (data) => {
				alert(`Systemkonfiguration ${data.name} wurde geändert.`);
				this.cancel();
			},
			error: (error) => this.setError(error)
		});
	}

	cancel() {
		this.location.back();
	}
}
