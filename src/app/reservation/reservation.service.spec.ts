import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';

import { ReservationService } from './reservation.service';
import { Reservation } from './reservation';
import { Occupation } from './occupation';
import { ReservationSystemConfig } from './reservation-system-config';

describe('ReservationService', () => {
  let service: ReservationService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        ReservationService,
      ],
    });
    service = TestBed.inject(ReservationService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getReservation should GET /rest/reservation/id/:id', () => {
    const mock = Reservation.EMPTY;
    service.getReservation(42).subscribe(r => expect(r).toEqual(mock));
    const req = http.expectOne('/rest/reservation/id/42');
    expect(req.request.method).toBe('GET');
    req.flush(mock);
  });

  it('getMyReservations should GET /rest/reservation/my', () => {
    service.getMyReservations().subscribe(list => expect(list.length).toBe(2));
    const req = http.expectOne('/rest/reservation/my');
    expect(req.request.method).toBe('GET');
    req.flush([Reservation.EMPTY, Reservation.EMPTY]);
  });

  it('getOccupation should GET /rest/reservation/occupation/:id', () => {
    service.getOccupation(7).subscribe();
    const req = http.expectOne('/rest/reservation/occupation/7');
    expect(req.request.method).toBe('GET');
    req.flush({});
  });

  it('getOccupations should GET /rest/reservation/getOccupations/:systemId/:date', () => {
    service.getOccupations(1, 1700000000000).subscribe(list => expect(list).toEqual([]));
    const req = http.expectOne('/rest/reservation/getOccupations/1/1700000000000');
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('addReservation should POST to /rest/reservation with the body', () => {
    const reservation = Reservation.EMPTY;
    service.addReservation(reservation).subscribe();
    const req = http.expectOne('/rest/reservation');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(reservation);
    req.flush(reservation);
  });

  it('checkReservation should POST to /rest/reservation/check', () => {
    const reservation = Reservation.EMPTY;
    service.checkReservation(reservation).subscribe();
    const req = http.expectOne('/rest/reservation/check');
    expect(req.request.method).toBe('POST');
    req.flush(reservation);
  });

  it('updateOccupation should PUT to /rest/reservation/occupation', () => {
    const occupation = {} as Occupation;
    service.updateOccupation(occupation).subscribe();
    const req = http.expectOne('/rest/reservation/occupation');
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(occupation);
    req.flush(occupation);
  });

  it('terminateReservation should PUT to /rest/reservation/terminate', () => {
    const reservation = Reservation.EMPTY;
    service.terminateReservation(reservation).subscribe();
    const req = http.expectOne('/rest/reservation/terminate');
    expect(req.request.method).toBe('PUT');
    req.flush(reservation);
  });

  it('deleteOccupation should DELETE /rest/reservation/occupation/:id', () => {
    service.deleteOccupation(5).subscribe();
    const req = http.expectOne('/rest/reservation/occupation/5');
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });

  it('getSystemConfig should GET /rest/systemconfig/getone/:id', () => {
    service.getSystemConfig(3).subscribe();
    const req = http.expectOne('/rest/systemconfig/getone/3');
    expect(req.request.method).toBe('GET');
    req.flush(ReservationSystemConfig.EMPTY);
  });

  it('getAllSystemConfigs should GET /rest/systemconfig/getall', () => {
    service.getAllSystemConfigs().subscribe(list => expect(list).toEqual([]));
    const req = http.expectOne('/rest/systemconfig/getall');
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });
});
