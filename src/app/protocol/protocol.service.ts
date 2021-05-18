import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Protocol } from './protocol';
import { Observable } from 'rxjs';

@Injectable()
export class ProtocolService {

  constructor(private httpClient: HttpClient) {
  }

  getAll(): Observable<Protocol[]> {
    return this.httpClient.get<Protocol[]>(`${this.url()}/protocol/get`);
  }
  getSince(date: number): Observable<Protocol[]> {
    return this.httpClient.get<Protocol[]>(`${this.url()}/protocol/get/${date}`);
  }
  private url() {
    return `${window.location.protocol}//${window.location.host}`;
  }
}
