import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

import { ReservationService } from '../reservation.service';
import { UserService } from '../../user/user.service';
import { User } from '../../user/user';
import { Reservation } from '../reservation';
import { ReservationType } from '../reservationtype';
import { ReservationSystemConfig } from '../reservation-system-config';


@Component({
  selector: 'reservation-modify',
  templateUrl: './reservation-modify.component.html',
  styleUrls: ['./reservation-modify.component.css']
})
export class ReservationModifyComponent {

  systemConfig: ReservationSystemConfig;
  reservation: Reservation;
  error: string;

  constructor(private route: ActivatedRoute, private router: Router, private location: Location,
    private service: ReservationService) {
  }

  ngOnInit() {
    this.systemConfig = this.service.getSystemConfig(this.route.snapshot.params['system']);
    const reservationId: number = this.route.snapshot.params['reservation'];
    this.service.getReservation(reservationId).subscribe(
      data => {
        this.reservation = data;
      },
      err => {
        this.setError(err);
      },
      () => {
        console.log ('finished get reservation ' + reservationId);
      }

    );
  }

  getDate(date:number) {
    const d = new Date();
    d.setTime(date);
    return d;
  }


  onDelete() {
    this.error = '';
    this.service.deleteReservation(this.reservation.id)
      .subscribe(
        data => {
          this.onBack();
        },
        err => {
          this.setError(err);
        },
        () => { this.onBack(); }
      )

  }

  private setError(error) {
    this.error = JSON.stringify(error);
    console.log(this.error);
  }

  onBack() {
    this.router.navigate(["/table", this.systemConfig.id, this.reservation.date]);
  }
}
