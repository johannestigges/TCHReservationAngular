import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApplicationProperties } from './application-properties';

@Injectable({
  providedIn: 'root',
})
export class ApplicationPropertiesService {
  constructor(private httpClient: HttpClient) {}

  getApplicationProperties(): Observable<ApplicationProperties> {
    return this.httpClient.get<ApplicationProperties>(
      `${this.url()}/properties`
    );
  }

  private url() {
    return `${window.location.protocol}//${window.location.host}/rest/application`;
  }
}
