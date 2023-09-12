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
    closingHour: FormControl<number>,
	types: FormArray<FormGroup<ReservationTypeForm>>
}

export interface ReservationTypeForm {

}

export function createSystemConfigForm(): FormGroup<SystemconfigForm> {
	const systemConfigForm: SystemconfigForm = {
		id: new FormControl(0, Validators.required) as FormControl<number>,
		name: new FormControl('', Validators.required) as FormControl<string>,
		title: new FormControl('', Validators.required) as FormControl<string>,
		courts: new FormArray([]) as unknown as  FormArray<FormControl<string>>,
		durationUnitInMinutes: new FormControl(60, Validators.required) as FormControl<number>,
		maxDaysReservationInFuture: new FormControl(0, Validators.required) as FormControl<number>,
		maxDuration: new FormControl(1, Validators.required) as FormControl<number>,
		openingHour: new FormControl(8, Validators.required) as FormControl<number>,
		closingHour: new FormControl(22, Validators.required) as FormControl<number>,
		types: new FormArray([]) as unknown as FormArray<FormGroup<ReservationTypeForm>>
	};
	return new FormGroup(systemConfigForm);
}