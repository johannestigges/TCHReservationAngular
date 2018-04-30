import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { DateUtil } from '../date/date-util';
import { Reservation } from './reservation';
import { ReservationType } from './reservationtype';
import { ReservationSystemConfig } from './reservation-system-config';
import { Occupation } from './occupation';

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
    return this.httpClient.get<Reservation>('/reservation/get/' + id);
  }

  getOccupations(systemConfigId: number, date: number): Observable<Occupation[]> {
    return this.httpClient.get<Occupation[]>('/reservation/getOccupations/' + systemConfigId + '/' + date);
  }

  addReservation(reservation: Reservation): Observable<Reservation> {
    return this.httpClient.post<Reservation>('/reservation/add', reservation);
  }

  deleteReservation(id: number): Observable<Reservation> {
    return this.httpClient.delete<Reservation>('/reservation/delete/' + id);
  }

  getSystemConfig(systemId): ReservationSystemConfig {
    return this.systemConfig[systemId];
  }
}
