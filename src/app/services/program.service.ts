import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { MessageService } from './message.service';

@Injectable({
  providedIn: 'root'
})
export class ProgramService {
  url:string;
  application="CMS";
  constructor(private httpclient:HttpClient,
    private messagesrv:MessageService) { 
      this.url=environment.url;
    }
    getAuthorizeProgramsformenu_62(obj){
      
      var myurl =this.url+"/revertResultProcess/getAuthPrograms.htm";
      let headers: HttpHeaders= new HttpHeaders();
      headers=headers.set('format', 'format');// format the response data from xml to json
      let param:HttpParams= new HttpParams();
      console.log("Arush Entity",obj);
      param=param
                 .set('entityId',obj) ;
           console.log("Arush Param",param);
      return  this.httpclient.get(myurl,{headers,params:param,responseType: 'text'});

    }



    getsession(){
      
      var myurl =this.url+"/revertResultProcess/getsession.htm";
      let headers: HttpHeaders= new HttpHeaders();
      headers=headers.set('format', 'format');// format the response data from xml to json
      
      return  this.httpclient.get(myurl,{headers,responseType: 'text'});

    }

    getbranches(obj){
      
      var myurl =this.url+"/revertResultProcess/getBranches.htm";
      let headers: HttpHeaders= new HttpHeaders();
      headers=headers.set('format', 'format');// format the response data from xml to json
      let param:HttpParams= new HttpParams();
      console.log(obj.pgm);
      param=param
          .set('programId',obj.pgm)
          .set('entityId',obj.entity) ;
           console.log("Arush Param",param);
      return  this.httpclient.get(myurl,{headers,params:param,responseType: 'text'});

    }
    getspc(obj){
      
      var myurl =this.url+"/revertResultProcess/getSpecializations.htm";
      let headers: HttpHeaders= new HttpHeaders();
      headers=headers.set('format', 'format');// format the response data from xml to json
      let param:HttpParams= new HttpParams();
      console.log(obj.pgm);
      param=param
          .set('programId',obj.pgm)
          .set('entityId',obj.entity) ;
          
      return  this.httpclient.get(myurl,{headers,params:param,responseType: 'text'});

    }

    vaildateProgram(obj){
      
      var myurl =this.url+"/revertResultProcess/vaildateProgram.htm";
      let headers: HttpHeaders= new HttpHeaders();
      headers=headers.set('format', 'format');// format the response data from xml to json
      let param:HttpParams= new HttpParams();
      console.log(obj);
      param=param
          .set('pgmObject',obj) ;
          
          
      return  this.httpclient.get(myurl,{headers,params:param,responseType: 'text'});

    }

    revertResult(obj){
      
      var myurl =this.url+"/revertResultProcess/revertProcessNew.htm";
      let headers: HttpHeaders= new HttpHeaders();
      headers=headers.set('format', 'format');// format the response data from xml to json
      let param:HttpParams= new HttpParams();
      console.log(obj);
      param=param
          .set('pgmObject',obj) ;
          
          
      return  this.httpclient.post(myurl,{},{headers,params:param,responseType: 'text'});

    }


    public log(message: string) {
      this.messagesrv.clear();
    this.messagesrv.add(`ProgramService: ${message}`);
    }
  
    public clear() {
      this.messagesrv.clear();
      }
}
