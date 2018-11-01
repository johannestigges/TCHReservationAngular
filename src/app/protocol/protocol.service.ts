import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { Protocol } from './protocol';
import { environment } from 'environments/environment';

const URL = environment.restURL;
const PROTOCOL_URL = URL + "/protocol/";

@Injectable()
export class ProtocolService {

  constructor(private httpClient: HttpClient) {
  }

  getAll(): Observable<Protocol[]> {
    return this.httpClient.get<Protocol[]>(PROTOCOL_URL + 'get');
  }
}
