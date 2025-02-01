import {Component, OnInit} from '@angular/core';
import {ReservationSystemConfig, SystemConfigReservationType} from 'src/app/reservation/reservation-system-config';
import {SystemconfigService} from '../systemconfig.service';
import {FormArray, FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {ErrorAware} from 'src/app/util/error/error-aware';
import {createSystemConfigForm, SystemconfigForm} from '../systemconfig-form';
import {Router} from '@angular/router';
import {weekDaysValues} from 'src/app/reservation/week-days';
import {userRoleValues} from '../../user/user-role.enum';
import {FieldErrorComponent} from "../../../util/field-error/field-error.component";
import {ShowErrorComponent} from "../../../util/show-error/show-error.component";
import {ReservationTypesComponent} from "../reservation-types/reservation-types.component";


@Component({
  selector: 'tch-systemconfig-add',
  templateUrl: './systemconfig-add.component.html',
  imports: [ReservationTypesComponent, FieldErrorComponent, ShowErrorComponent, ReactiveFormsModule],
  providers: [SystemconfigService]
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
  reservationTypeInEdit = -1;

  constructor(
    private router: Router,
    private systemconfigService: SystemconfigService
  ) {
    super();
    this.form = createSystemConfigForm();
  }

  ngOnInit() {
    this.form.controls.id.setValue(1);
    this.addCourt();
    this.form.controls.durationUnitInMinutes.setValue(60);
    this.form.controls.maxDaysReservationInFuture.setValue(1);
    this.form.controls.maxDuration.setValue(1);
    this.form.controls.openingHour.setValue(8);
    this.form.controls.closingHour.setValue(22);
  }

  addCourt(): void {
    this.courts.controls.push(new FormControl('') as FormControl<string>);
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
      this.getTypesFromForm()
    );

    this.systemconfigService.add(newconfig).subscribe({
      next: () => this.onCancel(),
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
        forbiddenDaysOfWeek: this.getWeekDaysFromForm(type.controls.forbiddenDaysOfWeek),
        cssStyle: type.controls.cssStyle.value,
        roles: this.getRolesFromForm(type.controls.roles)
      })
    );
    return types;
  }

  private getWeekDaysFromForm(form: FormArray<FormControl<boolean>>) {
    const weekDays: string[] = [];
    for (let i = 0; i < weekDaysValues.length; i++) {
      if (form.at(i).value) {
        weekDays.push(weekDaysValues[i]);
      }
    }
    return weekDays;
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
