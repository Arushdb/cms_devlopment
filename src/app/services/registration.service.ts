import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class RegistrationService {

  constructor(private httpclient:HttpClient) { }
  
   url="http://localhost:8080/CMS" ;
 // Url = 'assets/config.json';
  
   
 
  
   

    getdata(params:HttpParams){
       return  this.httpclient.get(this.url+params.get('method'),{responseType: 'text',params});
    }
   
   //gettencodes(params){
  
    
  //   this.myurl=""; 
  //  this.myurl = this.url+"/registrationforstudent/gettencodes.htm" ;
    
    
  // return  this.httpclient.get(this.myurl,{responseType: 'text',params});
   // let body="";
  // return  this.httpclient.post(myurl,body,{
  //   params,
  //   responseType: 'text'
   
  //    });
 
 //return  this.httpclient.post(myurl,body,{responseType: 'text',params});
 
   
    // }
     //getswitchdetail(params){
  
    //   this.myurl ="";
       
    //  this.myurl = this.url+"/registrationforstudent/getswitchdetail.htm" ;
    //   //let body="";
     
    // return  this.httpclient.get(this.myurl,{responseType: 'text',params});
    // //return  this.httpclient.post(myurl,body,{
    //  params,
    //  responseType: 'text'
     
    //   });
   
   //return  this.httpclient.post(myurl,body,{responseType: 'text',params});
   
     
      // }





    }
