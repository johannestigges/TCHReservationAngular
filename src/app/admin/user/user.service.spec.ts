import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';

import { UserService } from './user.service';
import { User } from './user';

describe('UserService', () => {
  let service: UserService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        UserService,
      ],
    });
    service = TestBed.inject(UserService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getLoggedInUser should GET /rest/user/me', () => {
    service.getLoggedInUser().subscribe(u => expect(u).toEqual(User.EMPTY));
    const req = http.expectOne('/rest/user/me');
    expect(req.request.method).toBe('GET');
    req.flush(User.EMPTY);
  });

  it('getAll should GET /rest/user/all', () => {
    service.getAll().subscribe(list => expect(list.length).toBe(0));
    const req = http.expectOne('/rest/user/all');
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('getUser should GET /rest/user/:id', () => {
    service.getUser(7).subscribe();
    const req = http.expectOne('/rest/user/7');
    expect(req.request.method).toBe('GET');
    req.flush(User.EMPTY);
  });

  it('addUser should POST to /rest/user with the user body', () => {
    service.addUser(User.EMPTY).subscribe();
    const req = http.expectOne('/rest/user');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(User.EMPTY);
    req.flush(User.EMPTY);
  });

  it('updateUser should PUT to /rest/user with the user body', () => {
    service.updateUser(User.EMPTY).subscribe();
    const req = http.expectOne('/rest/user');
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(User.EMPTY);
    req.flush(User.EMPTY);
  });

  it('login should POST to /login with form-encoded credentials', () => {
    service.login('alice', 'secret', false).subscribe();
    const req = http.expectOne('/login');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toBe('username=alice&password=secret&remember-me=false');
    expect(req.request.headers.get('content-type')).toBe('application/x-www-form-urlencoded');
    req.flush('OK');
  });

  it('login should include remember-me=true when requested', () => {
    service.login('bob', 'pw', true).subscribe();
    const req = http.expectOne('/login');
    expect(req.request.body).toContain('remember-me=true');
    req.flush('OK');
  });

  it('logout should GET /logout', () => {
    service.logout().subscribe();
    const req = http.expectOne('/logout');
    expect(req.request.method).toBe('GET');
    req.flush('OK');
  });
});
