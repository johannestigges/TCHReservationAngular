import {Component, Input, OnInit} from '@angular/core';
import {FormArray, FormControl, FormGroup, FormGroupDirective} from '@angular/forms';
import {ReservationTypeForm} from '../systemconfig-form';
import {userRoleNames, userRoleValues} from '../../user/user-role.enum';
import {weekDaysNames, weekDaysValues} from 'src/app/reservation/week-days';
import {NgFor, NgIf} from "@angular/common";
import {ReservationTypeComponent} from "../reservation-type/reservation-type.component";

@Component({
  selector: 'tch-reservation-types',
  templateUrl: './reservation-types.component.html',
  imports: [NgIf, NgFor, ReservationTypeComponent]
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
      .map((_, i) => roles.at(i).value ? userRoleNames[i] : null)
      .filter(role => role)
      .join(', ');
  }

  getWeekDays(weekDays: FormArray<FormControl<boolean>>): string {
    const weekDaysText = weekDaysValues
      .map((_, i) => weekDays.at(i).value ? weekDaysNames[i] : null)
      .filter(weekDay => weekDay)
      .join(', ');

    return weekDaysText ? 'gesperrt: ' + weekDaysText : '';
  }
}
