import { HttpInterceptor, HttpXsrfTokenExtractor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';


export class CorsInterceptor implements HttpInterceptor {
    constructor(private tokenExtractor: HttpXsrfTokenExtractor) { }
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let requestToForward = req;
        const token = this.tokenExtractor.getToken() as string;
        if (token !== null) {
            requestToForward = req.clone({ setHeaders: { 'X-XSRF-TOKEN': token } });
        }
        return next.handle(requestToForward);
    }

}
