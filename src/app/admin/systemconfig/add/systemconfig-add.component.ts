import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

import { ErrorAware } from '../../../util/error/error-aware';
import { ReservationSystemConfig } from 'src/app/reservation/reservation-system-config';
import { SystemconfigService } from '../systemconfig.service';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'tch-systemconfig-add',
  templateUrl: './systemconfig-add.component.html',
  styleUrls: ['./systemconfig-add.component.css']
})
export class SystemconfigAddComponent extends ErrorAware implements OnInit {

  form: FormGroup;
  courts: FormArray;

  durationUnits = [30, 60];
  maxDays = [1, 2, 3, 4, 5, 6, 7, 14, 21, 31, 62, 365];
  maxDurations = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
  openingHours = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24];
  closingHours = [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 1, 2, 3, 4, 5, 6];

  constructor(
    private location: Location,
    private formBuilder: FormBuilder,
    private systemconfigService: SystemconfigService) {
    super();
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      id: new FormControl('', Validators.required),
      name: new FormControl('', Validators.required),
      courts: new FormArray([]),
      durationUnitInMinutes: new FormControl('', Validators.required),
      maxDaysReservationInFuture: new FormControl('', Validators.required),
      maxDuration: new FormControl('', Validators.required),
      openingHour: new FormControl('', Validators.required),
      closingHour: new FormControl('', Validators.required)
    });

    this.form.get('id').setValue(1);
    this.addCourt();
    this.form.get('durationUnitInMinutes').setValue(60);
    this.form.get('maxDaysReservationInFuture').setValue(1);
    this.form.get('maxDuration').setValue(1);
    this.form.get('openingHour').setValue(8);
    this.form.get('closingHour').setValue(22);
  }

  createCourt(): FormGroup {
    return this.formBuilder.group({
      court: ''
    });
  }

  addCourt(): void {
    this.courts = this.form.get('courts') as FormArray;
    this.courts.push(new FormControl(''));
  }

  removeCourt(i: number): void {
    this.courts = this.form.get('courts') as FormArray;
    this.courts.removeAt(i);
  }

  onClick() {
    this.clearError();

    const newconfig = new ReservationSystemConfig(
      this.form.get('id').value,
      this.form.get('name').value,
      this.form.get('courts').value,
      this.form.get('durationUnitInMinutes').value,
      this.form.get('maxDaysReservationInFuture').value,
      this.form.get('maxDuration').value,
      this.form.get('openingHour').value,
      this.form.get('closingHour').value,
    );
    this.systemconfigService.add(newconfig).subscribe(
      data => this.cancel(),
      err => this.httpError = err
    );
  }

  cancel() {
    this.location.back();
  }
}
