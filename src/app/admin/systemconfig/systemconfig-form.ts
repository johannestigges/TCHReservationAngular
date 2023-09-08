import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';

export interface SystemconfigForm {
    id: FormControl<number>,
    name: FormControl<string>,
    title: FormControl<string>,
    courts: FormArray<FormControl<string>>,
    durationUnitInMinutes: FormControl<number>,
    maxDaysReservationInFuture: FormControl<number>,
    maxDuration: FormControl<number>,
    openingHour: FormControl<number>,
    closingHour: FormControl<number>
}

export function createSystemConfigForm(): FormGroup<SystemconfigForm> {
	return new FormGroup({
		id: new FormControl(0, Validators.required),
		name: new FormControl('', Validators.required),
		title: new FormControl('', Validators.required),
		courts: new FormArray([]),
		durationUnitInMinutes: new FormControl(60, Validators.required),
		maxDaysReservationInFuture: new FormControl(0, Validators.required),
		maxDuration: new FormControl(1, Validators.required),
		openingHour: new FormControl(8, Validators.required),
		closingHour: new FormControl(22, Validators.required)
	});
}