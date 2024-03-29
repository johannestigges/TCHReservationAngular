import { HttpInterceptor, HttpXsrfTokenExtractor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';


@Injectable()
export class CorsInterceptor implements HttpInterceptor {
	constructor(private tokenExtractor: HttpXsrfTokenExtractor) { }
	intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
		let requestToForward = req;
		const token = this.tokenExtractor.getToken() as string;
		if (token !== null) {
			requestToForward = req.clone({ setHeaders: { 'X-XSRF-TOKEN': token } });
		}
		return next.handle(requestToForward);
	}

}
