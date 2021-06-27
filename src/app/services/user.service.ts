import { HttpClient,  HttpHeaders, HttpParams, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MessageService } from './message.service';
import {environment} from 'src/environments/environment'
import { isUndefined } from 'typescript-collections/dist/lib/util';
	

@Injectable({
  providedIn: 'root'
})
export class UserService {

  url:string;
  constructor(private httpclient:HttpClient,
              private messagesrv:MessageService
    
    ) {
  this.url=environment.url;
  console.log("Envirnment:",this.url);

    }
  

 //url="http://admission.dei.ac.in:8085/CMS" ;
 //url="http://localhost:8080/CMS" ;
 
 
  //url="http://125.17.153.215:8089/CMS" ;
  //url="http://10.154.0.112:8089/CMS" ;

 
   
   application="CMS";
  
   getdata(params:HttpParams,myparam){
    console.log("enviorment=",this.url);  
 
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
      headers=headers.set('format', 'format');// format the response data from xml to json
    }else{
      headers=headers.set('format', 'None');// format the response data from xml to json
    } 

    //console.log(params.get('method')); 
    console.log(this.url);
    console.log("params",params);
  
    //myurl = this.url+params.get('method') ;
    myurl = this.url+myparam.method ;
    console.log(console.log(myurl));
   // return  this.httpclient.get(myurl,{headers,responseType: 'text',params});
   let body={};
    
   return  this.httpclient.get(myurl,{headers,responseType: 'text',params});

    
    }

  
    postdata(params,myparam){
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
        headers=headers.set('format', 'format');// format the response data from xml to json
      }else{
        headers=headers.set('format', 'None');// do not format the response data from xml to json
      } 
  
     
      myurl = this.url+myparam.method ;
     // console.log(console.log(myurl));
     // return  this.httpclient.get(myurl,{headers,responseType: 'text',params});
    let body={};

     //console.log("in post data",params);
      
     return  this.httpclient.post(myurl,body,{headers,params:params,responseType: 'text'});
  
      
      }

      postFile(fileToUpload: File,myparam) {
        let headers: HttpHeaders= new HttpHeaders();
        const endpoint = this.url+'/uploadfile/uploadfile.htm';

        const formData: FormData = new FormData();

    //
   // formData.append('name', "myfile");
    formData.append('name', myparam.filename);
   formData.append('filekey', fileToUpload);
    //formData.append('filekey', fileToUpload, fileToUpload.name);

    const customHeaders = new HttpHeaders({
      'Authorization': 'Bearer' + localStorage.getItem('token'),
      'Accepted-Encoding': 'application/json'
    });
  
    const customOptions = {
      headers: customHeaders,
      reportProgress: true,
    };

    if(myparam.xmltojs=="Y"){
      headers=headers.set('format', 'format');// format the response data from xml to json
    }else{
      headers=headers.set('format', 'None');// do not format the response data from xml to json
    } 
    if( !isUndefined(myparam.filepath))
    headers=headers.set('filepath', myparam.filepath);
    if( !isUndefined(myparam.filename))
    headers=headers.set('filename', myparam.filename);
  

       
      
       //const endpoint = this.url;
        
       
       
        return this.httpclient
          .post(endpoint, formData, {headers:headers,reportProgress: true, observe: 'events'})
        //  return this.httpclient
        //    .post(endpoint, formData)
          
    }



   /** Log a UserService message with the MessageService */
  public log(message: string) {
    this.messagesrv.clear();
  this.messagesrv.add(`User Service: ${message}`);
  }

  public clear() {
    this.messagesrv.clear();
    }
  


    
     }



