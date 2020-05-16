import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Reservation } from './reservation';
import { ReservationSystemConfig } from './reservation-system-config';
import { Occupation } from './occupation';
import { Observable } from 'rxjs';

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
    return this.httpClient.get<Reservation>(this.url() + 'get/' + id);
  }

  getOccupations(systemConfigId: number, date: number): Observable<Occupation[]> {
    return this.httpClient.get<Occupation[]>(this.url() + 'getOccupations/' + systemConfigId + '/' + date);
  }

  addReservation(reservation: Reservation): Observable<Reservation> {
    return this.httpClient.post<Reservation>(this.url() + 'add', reservation);
  }

  updateReservation(reservation: Reservation): Observable<Reservation> {
    return this.httpClient.put<Reservation>(this.url() + 'update', reservation);
  }

  deleteReservation(id: number): Observable<Reservation> {
    return this.httpClient.delete<Reservation>(this.url() + 'delete/' + id);
  }

  getSystemConfig(systemId: number): ReservationSystemConfig {
    return this.systemConfig[systemId];
  }

  private url() {
    return `${window.location.protocol}//${window.location.host}/reservation/`;
  }
}
