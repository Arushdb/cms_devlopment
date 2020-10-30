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

  constructor(private httpclient:HttpClient) {

  
   }
  
  url="http://localhost:8080/CMS" ;
 // Url = 'assets/config.json';
  
   
   application="CMS";
  
   
   
  startlogin(params){
  
    var myurl ="";
   
      let headers = new HttpHeaders();
      
      // headers =headers.append('Content-Type', 'application/json');
      // headers =headers.append('Accept', 'application/json');

      //headers=headers.append('Access-Control-Allow-Origin', 'http://localhost:4200');
     // headers=headers.append('Access-Control-Allow-Credentials', 'true');
      
     
     
     headers=headers.append('credentials', 'include');
     
      myurl = this.url+"/login/generateMenu.htm" ;

  
   myurl =
     this.url+"/login/loginProcedureStart.htm" ;
    let body="";
    return  this.httpclient.get(myurl,{headers,responseType: 'text',params});


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
      headers=headers.append('withCredentials', 'true');
      headers=headers.append('credentials', 'include');
      
      myurl = this.url+"/login/getLoginDetails.htm" ;
      let body="";
      //return  this.httpclient.post(myurl,body,{headers,responseType: 'text',params});
      return  this.httpclient.get(myurl,{headers,responseType: 'text',params});
 
     }

     getmenus(params){

      var myurl ="";
      let headers = new HttpHeaders();
      
      // headers =headers.append('Content-Type', 'application/json');
      // headers =headers.append('Accept', 'application/json');

      // headers=headers.append('Access-Control-Allow-Origin', 'http://localhost:8080');
     // headers=headers.append('Access-Control-Allow-Credentials', 'true');
      headers=headers.append('withCredentials', 'true');
      headers=headers.append('credentials', 'include');
      myurl = this.url+"/login/generateMenu.htm" ;
      let body="";
      //return  this.httpclient.post(myurl,body,{headers,responseType: 'text',params});
      return  this.httpclient.get(myurl,{headers,responseType: 'text',params});
 
     }


}
