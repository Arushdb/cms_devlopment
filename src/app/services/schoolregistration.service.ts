import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MessageService } from './message.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SchoolregistrationService {
 

  url:string;
  application="CMS";
  constructor(private httpclient:HttpClient,
    private messagesrv:MessageService) { 
      this.url=environment.url;
    }

    getschool(){
      var myurl =this.url+"/schoolregistration/getschool.htm";
      let headers: HttpHeaders= new HttpHeaders();
      headers=headers.set('format', 'None');
     // headers=headers.set('format', 'format');// format the response data from xml to json
      let param:HttpParams= new HttpParams();
      
      return  this.httpclient.get(myurl,{headers,params:param,responseType: 'text'});

    }

    getschoolprograms(){
      var myurl =this.url+"/schoolregistration/getprogram.htm";
      let headers: HttpHeaders= new HttpHeaders();
      headers=headers.set('format', 'None');
     // headers=headers.set('format', 'format');// format the response data from xml to json
      let param:HttpParams= new HttpParams();
      
      return  this.httpclient.get(myurl,{headers,params:param,responseType: 'text'});

    }

    getschoolbranches(){
      var myurl =this.url+"/schoolregistration/getbranches.htm";
      let headers: HttpHeaders= new HttpHeaders();
      headers=headers.set('format', 'None');
     // headers=headers.set('format', 'format');// format the response data from xml to json
      let param:HttpParams= new HttpParams();
      
      return  this.httpclient.get(myurl,{headers,params:param,responseType: 'text'});

    }

    savestudent(student:any){
      var myurl =this.url+"/schoolregistration/savestudent.htm";
      let headers: HttpHeaders= new HttpHeaders();
      headers=headers.set('format', 'None');
     // headers=headers.set('format', 'format');// format the response data from xml to json
      let param:HttpParams= new HttpParams();
      param=param.set("student",student)
       
      
      return  this.httpclient.post(myurl,{},{headers,params:param,responseType: 'text'});

    }

    getstudents(student:any){
      var myurl =this.url+"/schoolregistration/getstudents.htm";
      let headers: HttpHeaders= new HttpHeaders();
      headers=headers.set('format', 'None');
     // headers=headers.set('format', 'format');// format the response data from xml to json
      let param:HttpParams= new HttpParams();
      param=param.set("student",student)
       
      
      return  this.httpclient.post(myurl,{},{headers,params:param,responseType: 'text'});

    }

    lastclass(student:any){
      var myurl =this.url+"/schoolregistration/lastclass.htm";
      let headers: HttpHeaders= new HttpHeaders();
      headers=headers.set('format', 'None');
     // headers=headers.set('format', 'format');// format the response data from xml to json
      let param:HttpParams= new HttpParams();
      param=param.set("student",student);
       
      
      return  this.httpclient.post(myurl,{},{headers,params:param,responseType: 'text'});

    }

    importstudents(student:any){
      var myurl =this.url+"/schoolregistration/importstudents.htm";
      let headers: HttpHeaders= new HttpHeaders();
      headers=headers.set('format', 'None');
     // headers=headers.set('format', 'format');// format the response data from xml to json
      let param:HttpParams= new HttpParams();
     // param=param.set("student",student);
       
      
      return  this.httpclient.post(myurl,student,{headers,params:param,responseType: 'text'});

    }

    deletestudent(student:any){
      var myurl =this.url+"/schoolregistration/deletestudent.htm";
      let headers: HttpHeaders= new HttpHeaders();
      headers=headers.set('format', 'None');
     // headers=headers.set('format', 'format');// format the response data from xml to json
      let param:HttpParams= new HttpParams();
      param=param.set("student",student);
       
      
      return  this.httpclient.post(myurl,{},{headers,params:param,responseType: 'text'});

    }




}
