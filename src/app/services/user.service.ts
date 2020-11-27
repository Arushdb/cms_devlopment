import { HttpClient,  HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MessageService } from './message.service';
	

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private httpclient:HttpClient,
              private messagesrv:MessageService
    
    ) {}
  
  url="http://localhost:8080/CMS" ;

   
 
   
   application="CMS";
  
   getdata(params:HttpParams,myparam){
    var myurl ="";
    let headers: HttpHeaders= new HttpHeaders();
 
    
   // console.log("XMLJS flag",params.get("xmltojs"));
    // if(params.get("xmltojs")=="Y"){
    //   console.log("in xmljs");
    //   headers=headers.append('format', 'format');// format the response data from xml to json 
    // }else{
    //   headers=headers.append('format', 'None');// format the response data from xml to json
    // }
    if(myparam.xmltojs=="Y"){
      headers=headers.append('format', 'format');// format the response data from xml to json
    }else{
      headers=headers.append('format', 'None');// format the response data from xml to json
    } 

    console.log(params.get('method')); 
    console.log(this.url);
    console.log("params",params);
  
    //myurl = this.url+params.get('method') ;
    myurl = this.url+myparam.method ;
    console.log(console.log(myurl));
    return  this.httpclient.get(myurl,{headers,responseType: 'text',params});
 
    }

   /** Log a HeroService message with the MessageService */
  public log(message: string) {
  this.messagesrv.add(`User Service: ${message}`);
  }
    
     }



