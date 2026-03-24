import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';

import { ProtocolService } from './protocol.service';

describe('ProtocolService', () => {
  let service: ProtocolService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        ProtocolService,
      ],
    });
    service = TestBed.inject(ProtocolService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getSince should GET /rest/protocol/:date', () => {
    const date = 1700000000000;
    service.getSince(date).subscribe(list => expect(list).toEqual([]));
    const req = http.expectOne(`/rest/protocol/${date}`);
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });
});
