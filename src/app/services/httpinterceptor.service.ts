import { Injectable } from '@angular/core';
import {
  HttpEvent, HttpInterceptor, HttpHandler, HttpRequest,HTTP_INTERCEPTORS} from '@angular/common/http';

import { Observable } from 'rxjs';

@Injectable(

 // {providedIn: 'root'}
)
  
export class HttpinterceptorService implements HttpInterceptor{

  intercept(req: HttpRequest<any>, next: HttpHandler):
  Observable<HttpEvent<any>> {
  
    // console.log("interceptor: " + req.url);
    const API_Key ='123456';
    withCredentials: true
    req = req.clone({
      setHeaders:{API_Key},withCredentials: true
    });
    
    return next.handle(req);
}
}
