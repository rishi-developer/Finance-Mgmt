import { Inject, Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class ApiInterceptor implements HttpInterceptor {

  constructor( @Inject('BASE_API_URL') private baseUrl: string) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const { url, body } = request;

    let authToken = localStorage.getItem('token');
    let apiReq = request.clone(
      {
        url: `${this.baseUrl}/${request.url}`,
      }
    );
    if (authToken) {
      apiReq = apiReq.clone({
        headers: apiReq.headers.set('Authorization', `${'Bearer '+authToken}`),
      });
    }




    return next.handle(apiReq);
  }
}
