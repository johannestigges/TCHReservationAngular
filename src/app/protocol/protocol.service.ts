import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { Protocol } from './protocol';

@Injectable()
export class ProtocolService {

  constructor(private httpClient: HttpClient) {
  }

  getAll(): Observable<Protocol[]> {
    return this.httpClient.get<Protocol[]>('/protocol/get');
  }
}
