import {Component, OnDestroy, OnInit} from '@angular/core';
import {ReservationService} from "../reservation.service";
import {Location} from "@angular/common";
import {Reservation} from "../reservation";
import {DateUtil} from "../../util/date/date-util";
import {Subject, takeUntil} from 'rxjs';

@Component({
  selector: 'tch-my',
  templateUrl: './my-reservations.component.html',
  styleUrl: './my-reservations.component.scss'
})
export class MyReservationsComponent implements OnInit, OnDestroy {
  reservations: Reservation[] = [];

  private readonly destroy$ = new Subject<void>();

  constructor(
    private reservationService: ReservationService,
    private location: Location) {
  }

  ngOnInit(): void {
    this.reservationService.getMyReservations()
      .pipe(takeUntil(this.destroy$))
      .subscribe(reservations => this.reservations = reservations);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
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
