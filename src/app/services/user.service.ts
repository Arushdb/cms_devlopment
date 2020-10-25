import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
//import  'rxjs/add/operator/map' ;
import { map } from 'rxjs/operators';
import * as xml2js from 'xml2js';
	

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private httpclient:HttpClient) { }
  
  url="http://localhost:8080/CMS" ;
 // Url = 'assets/config.json';
  
   
   application="CMS";
  
   
   
  startlogin(params){
  
    var myurl ="";
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
  headers.append('Accept', 'application/json');

  headers.append('Access-Control-Allow-Origin', 'http://localhost:8080');
  headers.append('Access-Control-Allow-Credentials', 'true');

  
   myurl =
     this.url+"/login/loginProcedureStart.htm" ;
    let body="";

 //  return  this.httpclient.get(this.url,{responseType: 'text',params});
    
 
 
 return  this.httpclient.post(myurl,body,{responseType: 'text',params});
 
   
     }
}
