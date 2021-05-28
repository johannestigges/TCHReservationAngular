import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ReservationSystemConfig } from '../../reservation/reservation-system-config';

/**
 * reservation system config service
 */
@Injectable()
export class SystemconfigService {

  constructor(private httpClient: HttpClient) {
  }

  get(id: number): Observable<ReservationSystemConfig> {
    return this.httpClient.get<ReservationSystemConfig>(`${this.url()}/${id}`);
  }

  getAll(): Observable<ReservationSystemConfig[]> {
    return this.httpClient.get<ReservationSystemConfig[]>(`${this.url()}`);
  }

  add(systemconfig: ReservationSystemConfig): Observable<ReservationSystemConfig> {
    return this.httpClient.post<ReservationSystemConfig>(`${this.url()}/add`, systemconfig);
  }

  update(systemconfig: ReservationSystemConfig): Observable<ReservationSystemConfig> {
    return this.httpClient.put<ReservationSystemConfig>(`${this.url()}/update`, systemconfig);
  }

  delete(id: number): Observable<ReservationSystemConfig> {
    return this.httpClient.delete<ReservationSystemConfig>(`${this.url()}/delete/${id}`);
  }

  private url() {
    return `${window.location.protocol}//${window.location.host}/rest/systemconfig`;
  }
}
