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
		return this.httpClient.get<ReservationSystemConfig>(`${this.url()}/getone/${id}`);
	}

	getAll(): Observable<ReservationSystemConfig[]> {
		return this.httpClient.get<ReservationSystemConfig[]>(this.url());
	}

	add(systemconfig: ReservationSystemConfig): Observable<ReservationSystemConfig> {
		return this.httpClient.post<ReservationSystemConfig>(this.url(), systemconfig);
	}

	update(systemconfig: ReservationSystemConfig): Observable<ReservationSystemConfig> {
		return this.httpClient.put<ReservationSystemConfig>(this.url(), systemconfig);
	}

	delete(id: number): Observable<ReservationSystemConfig> {
		return this.httpClient.delete<ReservationSystemConfig>(`${this.url()}/${id}`);
	}

	private url() {
		return '/rest/systemconfig';
	}
}
