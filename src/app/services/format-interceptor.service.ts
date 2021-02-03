import { Injectable } from '@angular/core';
import * as xml2js from 'xml2js';


import { HttpInterceptor, HttpEvent, HttpResponse, HttpRequest, HttpHandler } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, filter } from 'rxjs/operators';

@Injectable(
 
)
export class FormatInterceptorService implements HttpInterceptor {

  intercept(httpRequest: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
   
    let format:string ="";
   
   //  if(httpRequest)
   try{
    format =httpRequest.headers.get('format');
   }catch(error){
     format="format";
     //console.log(error);
   }
   console.log(format); 
         
     return next.handle(httpRequest).pipe(

      
    
      //filter(event => (event instanceof HttpResponse && format=='format')),
      filter(event => (event instanceof HttpResponse )),
       // event => event instanceof HttpResponse && httpRequest.url.includes('format')),
              
      map( 
               
        (event: HttpResponse<any>):HttpResponse<any>  => {
      let data = null;
      
      if(format=='format'){

      xml2js.parseString( event.body , function (err, result){ 
          data =result;
                     
        });
        //console.log("in interceptor",data);
        return event.clone({body:JSON.stringify(data)});
      }else{
        //console.log("in else of map");
        return event;
      }
      
      
      }
       
           ))
    
  }
}
