import { Injectable } from '@angular/core';
import * as xml2js from 'xml2js';


import { HttpInterceptor, HttpEvent, HttpResponse, HttpRequest, HttpHandler } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, filter } from 'rxjs/operators';

@Injectable(
 
)
export class FormatInterceptorService implements HttpInterceptor {

  intercept(httpRequest: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(httpRequest).pipe(
      
      filter(event => event instanceof HttpResponse && httpRequest.url.includes('format')),

      map(
        (event: HttpResponse<any>) => event.clone({ body: ()=>{
                xml2js.parseString( event.body, function (err, result){
        return result;     
        
      });
                
         }})
         
         )
    );
  }
}
