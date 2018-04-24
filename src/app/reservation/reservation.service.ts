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

  private systemConfig: { [key: number]: ReservationSystemConfig; } = {};

  constructor(private httpClient: HttpClient) {
    // initialize system config
    this.systemConfig[1] = new ReservationSystemConfig(1, "Außenplätze", 6, 30, 8, 22, 0, 4);
    this.systemConfig[2] = new ReservationSystemConfig(1, "Hallenplätze", 2, 30, 8, 22, 0, 480);
  }

  getReservation(id: number): Observable<Reservation> {
    return this.httpClient.get<Reservation>(BACKEND_URL + '/reservation/get/' + id);
  }

  getOccupations(systemConfigId: number, date: number): Observable<Occupation[]> {
    return this.httpClient.get<Occupation[]>(BACKEND_URL + '/reservation/getOccupations/' + systemConfigId + '/' + date);
  }

  addReservation(reservation: Reservation): Observable<Reservation> {
    return this.httpClient.post<Reservation>(BACKEND_URL + '/reservation/add', reservation);
  }

  deleteReservation(id: number): Observable<Reservation> {
    return this.httpClient.delete<Reservation>(BACKEND_URL + '/reservation/delete/' + id);
  }

  getSystemConfig(systemId): ReservationSystemConfig {
    return this.systemConfig[systemId];
  }
}
