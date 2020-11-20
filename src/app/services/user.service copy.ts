import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable, throwError } from 'rxjs';

//import  'rxjs/add/operator/map' ;
import { map,catchError, retry } from 'rxjs/operators';


import * as xml2js from 'xml2js';
import { MessageService } from './message.service';
	

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private httpclient:HttpClient,
              private messagesrv:MessageService
    
    ) {

  
   }
  
  url="http://localhost:8080/CMS/1" ;

  private headers: HttpHeaders;
  
 // Url = 'assets/config.json';
  
   
   application="CMS";
  
   getdata(params:HttpParams){
    var myurl ="";
    this.headers = new HttpHeaders();
    if(params.get("xmltojs")=="Y"){
      this.headers=this.headers.append('format', 'format');
    }
     // format the response from xml to json 
    myurl = this.url+params.get('method') ;
 console.log("url: ",myurl);
   return  this.httpclient.get(myurl,{responseType: 'text',params})
  //  .pipe(
  //  retry(2),
  //   catchError((error:HttpErrorResponse)=>{
  //    if(error.status===404) 
  //      return throwError("not found"||'server error') ;
  //    else
  //    return throwError('server not working') ;
  //   })
  //    )
   ;

   }

   /** Log a HeroService message with the MessageService */
public log(message: string) {
  this.messagesrv.add(`User Service: ${message}`);
}
   
  startlogin(params){
  
    var myurl ="";
   
      let headers = new HttpHeaders();
      
      // headers =headers.append('Content-Type', 'application/json');
      // headers =headers.append('Accept', 'application/json');

      //headers=headers.append('Access-Control-Allow-Origin', 'http://localhost:4200');
     // headers=headers.append('Access-Control-Allow-Credentials', 'true');
      
     
     
     //headers=headers.append('credentials', 'include');
     headers=headers.append('format', 'format'); // format the response from xml to json
     
    

  
   myurl =
     this.url+"/login/loginProcedureStart.htm" ;
    let body="";
    return  this.httpclient.get(myurl,{responseType: 'text',params});


   //return  this.httpclient.get(myurl,{headers,responseType: 'text',params,withCredentials: true});
    
 
 
 //return  this.httpclient.post(myurl,body,{headers ,responseType: 'text',params});
 
   
     }

     getLoginDetails(params){


      
      var myurl ="";
      let headers = new HttpHeaders();
      
     // headers =headers.append('Content-Type', 'application/json');
     // headers =headers.append('Accept', 'application/json');

      //headers=headers.append('Access-Control-Allow-Origin', 'http://localhost:8080');
     // headers=headers.append('Access-Control-Allow-Credentials', 'true');
      // headers=headers.append('withCredentials', 'true');
      // headers=headers.append('credentials', 'include');

      headers=headers.append('format', 'format'); // format the response from xml to json
      
      myurl = this.url+"/login/getLoginDetails.htm" ;
      let body="";
      //return  this.httpclient.post(myurl,body,{headers,responseType: 'text',params});
      return  this.httpclient.get(myurl,{responseType: 'text',params});
 
     }

     getmenus(params){

      var myurl ="";
      let headers = new HttpHeaders();
      
      // headers =headers.append('Content-Type', 'application/json');
      // headers =headers.append('Accept', 'application/json');

      // headers=headers.append('Access-Control-Allow-Origin', 'http://localhost:8080');
     // headers=headers.append('Access-Control-Allow-Credentials', 'true');
     // headers=headers.append('withCredentials', 'true');
     // headers=headers.append('credentials', 'include');

     headers=headers.append('format', 'format');  // format the response from xml to json
      myurl = this.url+"/login/generateMenu.htm" ;
      let body="";
      //return  this.httpclient.post(myurl,body,{headers,responseType: 'text',params});
      return  this.httpclient.get(myurl,{responseType: 'text',params});
 
     }


}
