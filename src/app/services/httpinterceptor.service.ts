import { Injectable } from '@angular/core';
import {
  HttpEvent, HttpInterceptor, HttpHandler, HttpRequest,HTTP_INTERCEPTORS, HttpErrorResponse} from '@angular/common/http';

import { Observable ,throwError} from 'rxjs';
import { map,catchError, retry } from 'rxjs/operators';
import {AppError}  from "../AppErrors/app-error" ;
import {NotFoundError}  from "../AppErrors/not-found-error" ;
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
    
    return next.handle(req).pipe(

      //retry(2),
      catchError((error:HttpErrorResponse)=>{
       
        

       if(error.status===404)
          return throwError(new NotFoundError()) ;
             
       return throwError(new AppError(error) );
      })

    );
}
}
