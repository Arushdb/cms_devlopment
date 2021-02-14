import { Injectable } from '@angular/core';
import * as xml2js from 'xml2js';


import { HttpInterceptor, HttpEvent, HttpResponse, HttpRequest, HttpHandler } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, filter } from 'rxjs/operators';
import { isUndefined } from 'typescript-collections/dist/lib/util';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { UserService } from './user.service';

@Injectable(
 
)
export class FormatInterceptorService implements HttpInterceptor {

  constructor( public authService: AuthService,private router: Router,  private userservice:UserService,){

  }

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
      let timeout=false;
      
      if(format=='format'){

      xml2js.parseString( event.body , function (err, result){ 
          data =result;
          
          if(!(isUndefined(data))){
            if(!(isUndefined(data.Details))){
              if(!(isUndefined(data.Details.sessionConfirm))){
                if(String(data.Details.sessionConfirm).toString().trim()==="true"){
                  console.log("Session time out occured");
                  
                  timeout=true;
                
                }
               
              }
                 
            }
                 
          }
           
                      
        });
        //console.log("in interceptor",data);
        if(timeout){
          this.userservice.log("Session time out occured");
                this.authService.logout();
                  this.router.navigate(['/login']);
        }else{
          return event.clone({body:JSON.stringify(data)});
        }
        
      }else{
        //console.log("in else of map");
        return event;
      }
      
      
      }
       
           ))
    
  }
}
