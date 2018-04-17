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

  user: User;
  systemConfig: ReservationSystemConfig;
  reservation: Reservation;
  error: string;

  constructor(private route: ActivatedRoute, private router: Router, private location: Location,
    private service: ReservationService, private userService: UserService) {
  }

  ngOnInit() {
    this.user = this.userService.getUser(this.route.snapshot.params['user']);
    this.systemConfig = this.service.getSystemConfig(this.route.snapshot.params['system']);
    this.service.getReservation(this.route.snapshot.params['reservation'])
      .subscribe(r => this.reservation = r);
  }

  getStart() {
    return new Date(this.reservation.start);
  }

  onDelete() {
    this.service.deleteReservation(this.reservation.id)
      .subscribe(
        data => {
          this.onBack();
        },
        err => {
          this.showError(err);
        },
        () => { this.onBack(); }
      );
  }

  private showError(error) {
    this.error = error;
    console.log(error);
  }

  onBack() {
    this.router.navigate(["/table", this.systemConfig.id, this.user.id, this.reservation.start]);
  }
}
