import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

import { DateUtil } from '../date/date-util';
import { Reservation } from './reservation';
import { ReservationType } from './reservationtype';
import { ReservationSystemConfig } from './reservation-system-config';
import { Occupation } from './occupation';

const BACKEND_URL = ""; // "http://tchserver.fritz.box:8080";
/**
 * reservation service
 */
@Injectable()
export class ReservationService {

  public occupations: Occupation[] = [];
  private reservation: Reservation;
  private systemConfig: { [key: number]: ReservationSystemConfig; } = {};
  public error: string;

  constructor(private httpClient: HttpClient) {
    // initialize system config
    this.systemConfig[1] = new ReservationSystemConfig(1, "Außenplätze", 6, 30, 8, 22, 0, 4);
    this.systemConfig[2] = new ReservationSystemConfig(1, "Hallenplätze", 2, 30, 8, 22, 0, 480);

  }

  getReservation(id: number): Observable<Reservation> {
    this.httpClient.get<Reservation>(BACKEND_URL + '/reservation/' + id)
      .subscribe(
        data => { this.reservation = data; },
        err => { this.setError(err); },
        () => { console.log("done get reservation " + id); }
      );
    return of(this.reservation);
  }

  getOccupations(systemConfigId: number, date: Date) {
    return this.httpClient.get<Occupation[]>(BACKEND_URL + '/reservation/getOccupations/' + systemConfigId + '/' + date.getTime())
    .subscribe (
      data => { this.occupations = data; },
      err => { this.setError(err); },
      () => { console.log("done loading occupations for " + date); }
    );
  }

  addReservation(reservation: Reservation) {
    console.log('add reservation');
    console.log(reservation);
    this.httpClient.post<Reservation>(BACKEND_URL + '/reservation/add', reservation)
    .subscribe(
      data => { console.log(data); },
      err => { this.setError(err); },
      () => { console.log("done add reservation"); }
    );
  }

  deleteReservation(id: number) {
    console.log('delete ' + id)
    this.httpClient.delete(BACKEND_URL + '/reservation/delete/' + id)
    .subscribe(
      data => { console.log(data); },
      err => { this.setError(err); },
      () => { console.log("done deleted " + id); }
    );
  }

  private setError(err) {
    this.error = err;
    console.log(err);
  }

  getSystemConfig(systemId) {
    return this.systemConfig[systemId];
  }
}
