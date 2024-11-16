import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { UserRoleType, userRoleValues } from '../user/user-role.enum';
import { weekDaysValues } from 'src/app/reservation/week-days';

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
	id: FormControl<number>,
	name: FormControl<string>,
	maxDuration: FormControl<number>,
	maxDaysReservationInFuture: FormControl<number>,
	maxCancelInHours: FormControl<number>,
	repeatable: FormControl<boolean>,
	publicVisible: FormControl<boolean>,
	forbiddenDaysOfWeek: FormArray<FormControl<boolean>>,
	cssStyle: FormControl<string>
	roles: FormArray<FormControl<boolean>>
}

export interface ReservationTypeValues {
	id: number,
	name: string,
	maxDuration: number,
	maxDaysReservationInFuture: number,
	maxCancelInHours: number,
	repeatable: boolean,
	publicVisible: boolean,
	forbiddenDaysOfWeek: boolean[],
	cssStyle: string,
	roles: boolean[]
}

export function createSystemConfigForm(): FormGroup<SystemconfigForm> {
	const systemConfigForm: SystemconfigForm = {
		id: new FormControl(0, { nonNullable: true, validators: [Validators.required] }),
		name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
		title: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
		courts: new FormArray<FormControl<string>>([]),
		durationUnitInMinutes: new FormControl(60, { nonNullable: true, validators: [Validators.required] }),
		maxDaysReservationInFuture: new FormControl(0, { nonNullable: true, validators: [Validators.required] }),
		maxDuration: new FormControl(1, { nonNullable: true, validators: [Validators.required] }),
		openingHour: new FormControl(8, { nonNullable: true, validators: [Validators.required] }),
		closingHour: new FormControl(22, { nonNullable: true, validators: [Validators.required] }),
		types: new FormArray<FormGroup<ReservationTypeForm>>([])
	};
	return new FormGroup(systemConfigForm);
}

export function createReservationTypeForm(): FormGroup<ReservationTypeForm> {
	const reservationTypeForm: ReservationTypeForm = {
		id: new FormControl(0, { nonNullable: true, validators: [Validators.required] }),
		name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
		maxDuration: new FormControl(0, { nonNullable: true }),
		maxDaysReservationInFuture: new FormControl(0, { nonNullable: true }),
		maxCancelInHours: new FormControl(0, { nonNullable: true }),
		repeatable: new FormControl(true, { nonNullable: true }),
		publicVisible: new FormControl(true, { nonNullable: true }),
		forbiddenDaysOfWeek: new FormArray<FormControl<boolean>>(createWeekDays()),
		cssStyle: new FormControl<string>('', { nonNullable: true }),
		roles: new FormArray<FormControl<boolean>>(createUserRoles())
	};
	return new FormGroup(reservationTypeForm);
}
export function createUserRoles() {
	return userRoleValues.map(userRole => createUserRole(userRole));
}
export function createWeekDays() {
	return weekDaysValues.map(() => createWeekDay());
}
function createUserRole(userRole: UserRoleType) {
	const control = new FormControl<boolean>(false, { nonNullable: true });
	if (isAdmin(userRole)) {
		control.setValue(true);
		control.disable();
	}
	return control;
}
function createWeekDay() {
	return new FormControl<boolean>(false, { nonNullable: true });
}
function isAdmin(userRole: UserRoleType) {
	return userRole === 'ADMIN';
}
