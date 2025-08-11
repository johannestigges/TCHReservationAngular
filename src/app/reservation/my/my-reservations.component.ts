import {Component, OnInit} from '@angular/core';
import {ReservationService} from "../reservation.service";
import {Location} from "@angular/common";
import {Reservation} from "../reservation";
import {DateUtil} from "../../util/date/date-util";

@Component({
  selector: 'tch-my',
  providers: [ReservationService],
  templateUrl: './my-reservations.component.html',
  styleUrl: './my-reservations.component.scss'
})
export class MyReservationsComponent implements OnInit {
  reservations: Reservation[] = [];

  constructor(
    private reservationService: ReservationService,
    private location: Location) {
  }

  ngOnInit(): void {
    this.reservationService.getMyReservations()
      .subscribe(reservations => this.reservations = reservations);
  }

  toDate(date: number) {
    return DateUtil.toDate(date).toLocaleDateString();
  }

  toTime(time: number) {
    return DateUtil.showTime(time);
  }

  onCancel() {
    this.location.back();
  }
}
