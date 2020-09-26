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

  constructor(private httpClient: HttpClient) {
  }

  getReservation(id: number): Observable<Reservation> {
    return this.httpClient.get<Reservation>(`${this.url()}get/${id}`);
  }

  getOccupations(systemConfigId: number, date: number): Observable<Occupation[]> {
    return this.httpClient.get<Occupation[]>(`${this.url()}getOccupations/${systemConfigId}/${date}`);
  }

  addReservation(reservation: Reservation): Observable<Reservation> {
    return this.httpClient.post<Reservation>(`${this.url()}add`, reservation);
  }

  updateReservation(reservation: Reservation): Observable<Reservation> {
    return this.httpClient.put<Reservation>(`${this.url()}update`, reservation);
  }

  terminateReservation(reservation: Reservation): Observable<Reservation> {
    return this.httpClient.put<Reservation>(this.url() + 'terminate', reservation);
  }

  deleteReservation(id: number): Observable<Reservation> {
    return this.httpClient.delete<Reservation>(`${this.url()}delete/${id}`);
  }

  getSystemConfig(systemId: number): Observable<ReservationSystemConfig> {
    return this.httpClient.get<ReservationSystemConfig>(`${this.url()}systemconfig/${systemId}`);
  }

  private url() {
    return `${window.location.protocol}//${window.location.host}/reservation/`;
  }
}
