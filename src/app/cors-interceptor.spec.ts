import { HttpRequest, HttpHandler, HttpEvent, HttpXsrfTokenExtractor } from '@angular/common/http';
import { Observable, EMPTY } from 'rxjs';

import { CorsInterceptor } from './cors-interceptor';

class FakeHandler implements HttpHandler {
  lastRequest: HttpRequest<unknown> | null = null;
  handle(req: HttpRequest<unknown>): Observable<HttpEvent<unknown>> {
    this.lastRequest = req;
    return EMPTY;
  }
}

describe('CorsInterceptor', () => {
  let interceptor: CorsInterceptor;
  let tokenExtractor: jasmine.SpyObj<HttpXsrfTokenExtractor>;
  let handler: FakeHandler;

  beforeEach(() => {
    tokenExtractor = jasmine.createSpyObj<HttpXsrfTokenExtractor>('HttpXsrfTokenExtractor', ['getToken']);
    interceptor = new CorsInterceptor(tokenExtractor);
    handler = new FakeHandler();
  });

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });

  it('should add X-XSRF-TOKEN header when a token is available', () => {
    tokenExtractor.getToken.and.returnValue('test-csrf-token');
    const req = new HttpRequest('GET', '/api/test');

    interceptor.intercept(req, handler).subscribe();

    expect(handler.lastRequest?.headers.get('X-XSRF-TOKEN')).toBe('test-csrf-token');
  });

  it('should forward the original request unchanged when no token is available', () => {
    tokenExtractor.getToken.and.returnValue(null);
    const req = new HttpRequest('GET', '/api/test');

    interceptor.intercept(req, handler).subscribe();

    expect(handler.lastRequest).toBe(req);
    expect(handler.lastRequest?.headers.has('X-XSRF-TOKEN')).toBeFalse();
  });

  it('should not modify the original request object (uses clone)', () => {
    tokenExtractor.getToken.and.returnValue('some-token');
    const req = new HttpRequest('GET', '/api/test');

    interceptor.intercept(req, handler).subscribe();

    expect(handler.lastRequest).not.toBe(req);
  });
});
