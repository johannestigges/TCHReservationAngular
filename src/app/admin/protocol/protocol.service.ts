import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Protocol } from './protocol';
import { Observable } from 'rxjs';

@Injectable()
export class ProtocolService {

	constructor(private httpClient: HttpClient) {
	}

	getSince(date: number): Observable<Protocol[]> {
		return this.httpClient.get<Protocol[]>(`${this.url()}/${date}`);
	}

	private url() {
		return '/rest/protocol';
	}
}
