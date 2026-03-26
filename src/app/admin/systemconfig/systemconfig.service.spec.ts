import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';

import { SystemconfigService } from './systemconfig.service';
import { ReservationSystemConfig } from '../../reservation/reservation-system-config';

describe('SystemconfigService', () => {
  let service: SystemconfigService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        SystemconfigService,
      ],
    });
    service = TestBed.inject(SystemconfigService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('get should GET /rest/systemconfig/getone/:id', () => {
    service.get(5).subscribe();
    const req = http.expectOne('/rest/systemconfig/getone/5');
    expect(req.request.method).toBe('GET');
    req.flush(ReservationSystemConfig.EMPTY);
  });

  it('getAll should GET /rest/systemconfig/getall', () => {
    service.getAll().subscribe(list => expect(list).toEqual([]));
    const req = http.expectOne('/rest/systemconfig/getall');
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('add should POST to /rest/systemconfig with the body', () => {
    const cfg = ReservationSystemConfig.EMPTY;
    service.add(cfg).subscribe();
    const req = http.expectOne('/rest/systemconfig');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(cfg);
    req.flush(cfg);
  });

  it('update should PUT to /rest/systemconfig with the body', () => {
    const cfg = ReservationSystemConfig.EMPTY;
    service.update(cfg).subscribe();
    const req = http.expectOne('/rest/systemconfig');
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(cfg);
    req.flush(cfg);
  });

  it('delete should DELETE /rest/systemconfig/:id', () => {
    service.delete(3).subscribe();
    const req = http.expectOne('/rest/systemconfig/3');
    expect(req.request.method).toBe('DELETE');
    req.flush(ReservationSystemConfig.EMPTY);
  });
});
