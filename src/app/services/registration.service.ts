import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
//import  'rxjs/add/operator/map' ;
import { map } from 'rxjs/operators';
import * as xml2js from 'xml2js';

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {

  constructor(private httpclient:HttpClient) { }
  
  url="http://localhost:8080/CMS" ;
 // Url = 'assets/config.json';
  
   
   application="CMS";
  
   
   
   gettencodes(params){
  
    var myurl ="";
     
   myurl =
     this.url+"/registrationforstudent/gettencodes.htm" ;
    //let body="";
    console.log(params+"Arush");

 
   

  //return  this.httpclient.get(myurl,{responseType: 'text',params});
  return  this.httpclient.post(myurl,{
    params,
    responseType: 'text'
     });
 
 
 //return  this.httpclient.post(myurl,body,{responseType: 'text',params});
 
   
     }
    }
