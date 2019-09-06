import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { DateUtil } from '../date/date-util';
import { Reservation } from './reservation';
import { ReservationType } from './reservationtype';
import { ReservationSystemConfig } from './reservation-system-config';
import { Occupation } from './occupation';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

const URL = environment.restURL;
const RESERVATION_URL = URL + '/reservation/';

/**
 * reservation service
 */
@Injectable()
export class ReservationService {


  private systemConfig: { [key: number]: ReservationSystemConfig; } = {};

  constructor(private httpClient: HttpClient) {
    // initialize system config
    this.systemConfig[1] = new ReservationSystemConfig(1, 'Außenplätze', 6, 30, 8, 22, 0, 4);
    this.systemConfig[2] = new ReservationSystemConfig(1, 'Hallenplätze', 2, 30, 8, 22, 0, 480);
  }

  getReservation(id: number): Observable<Reservation> {
    return this.httpClient.get<Reservation>(RESERVATION_URL + 'get/' + id);
  }

  getOccupations(systemConfigId: number, date: number): Observable<Occupation[]> {
    return this.httpClient.get<Occupation[]>(RESERVATION_URL + 'getOccupations/' + systemConfigId + '/' + date);
  }

  addReservation(reservation: Reservation): Observable<Reservation> {
    return this.httpClient.post<Reservation>(RESERVATION_URL + 'add', reservation);
  }

  updateReservation(reservation: Reservation): Observable<Reservation> {
    return this.httpClient.put<Reservation>(RESERVATION_URL + 'update', reservation);
  }

  deleteReservation(id: number): Observable<Reservation> {
    return this.httpClient.delete<Reservation>(RESERVATION_URL + 'delete/' + id);
  }

  getSystemConfig(systemId: number): ReservationSystemConfig {
    return this.systemConfig[systemId];
  }
}
