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
  constructor(private httpClient: HttpClient) {}

  getReservation(id: number): Observable<Reservation> {
    return this.httpClient.get<Reservation>(`${this.url()}/${id}`);
  }

  getOccupation(id: number) {
    return this.httpClient.get<Occupation>(`${this.url()}/occupation/${id}`);
  }

  getOccupations(
    systemConfigId: number,
    date: number
  ): Observable<Occupation[]> {
    return this.httpClient.get<Occupation[]>(
      `${this.url()}/getOccupations/${systemConfigId}/${date}`
    );
  }

  addReservation(reservation: Reservation): Observable<Reservation> {
    return this.httpClient.post<Reservation>(this.url(), reservation);
  }

  checkReservation(reservation: Reservation): Observable<Reservation> {
    return this.httpClient.post<Reservation>(
      `${this.url()}/check`,
      reservation
    );
  }

  updateOccupation(occupation: Occupation): Observable<Occupation> {
    return this.httpClient.put<Occupation>(
      `${this.url()}/occupation`,
      occupation
    );
  }

  terminateReservation(reservation: Reservation): Observable<Reservation> {
    return this.httpClient.put<Reservation>(
      `${this.url()}/terminate`,
      reservation
    );
  }

  deleteOccupation(id: number): Observable<Occupation> {
    return this.httpClient.delete<Occupation>(`${this.url()}/occupation/${id}`);
  }

  getSystemConfig(systemId: number): Observable<ReservationSystemConfig> {
    return this.httpClient.get<ReservationSystemConfig>(
      `${this.url()}/systemconfig/${systemId}`
    );
  }

  private url() {
    return '/rest/reservation';
  }
}
