import { Injectable } from '@angular/core';
import { HttpClient,  HttpHeaders, HttpParams, HttpRequest } from '@angular/common/http';
import { MessageService } from './message.service';
import { isUndefined } from 'typescript-collections/dist/lib/util';
import {environment} from '../../environments/environment'; //'src/environments/environment'


@Injectable({
  providedIn: 'root'
})
export class InstructorcourseService {
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
  
  getdata(params:HttpParams,myparam)
  {
    //console.log("enviorment=",this.url);   
    var myurl ="";
    let headers: HttpHeaders= new HttpHeaders();
    if(myparam.xmltojs=="Y"){
      headers=headers.set('format', 'format');// format the response data from xml to json
    }else{
      headers=headers.set('format', 'None');// format the response data from xml to json
    } 
    //console.log(this.url);
    //console.log("params",params);
    myurl = this.url+myparam.method ;
    //console.log(console.log(myurl));
    // return  this.httpclient.get(myurl,{headers,responseType: 'text',params});
    let body={};
    return  this.httpclient.get(myurl,{headers,responseType: 'text',params});
  }
  
  getSessiondata(params:HttpParams)
  {
    var myurl ="";
    let headers: HttpHeaders= new HttpHeaders();
    headers=headers.set('format', 'format');// format the response data from xml to json
    myurl = this.url + "/manageprogsetupClone/loadSemesterDateForAssign.htm" ;
    //console.log(console.log(myurl));
    //console.log("params",params);
    let body={};
    return  this.httpclient.get(myurl,{headers,responseType: 'text',params});
  }
  
  checkCourseAccess(params:HttpParams)
  {
    var myurl ="";
    let headers: HttpHeaders= new HttpHeaders();
    headers=headers.set('format', 'format');// format the response data from xml to json
    myurl = this.url + "/manageprogsetupClone/checkCourseAccess.htm" ;
    let body={};
    return  this.httpclient.get(myurl,{headers,responseType: 'text',params});
  }

  getAssignedCourseInstructors(params:HttpParams)
  {
    var myurl ="";
    let headers: HttpHeaders= new HttpHeaders();
    headers=headers.set('format', 'format');// format the response data from xml to json
    myurl = this.url + "/manageprogsetupClone/LoadSecondGrid.htm" ;
    let body={};
    return  this.httpclient.get(myurl,{headers,responseType: 'text',params});
  }
  
  getCoursePckList(params:HttpParams)
  {
    var myurl ="";
    let headers: HttpHeaders= new HttpHeaders();
    headers=headers.set('format', 'format');// format the response data from xml to json
    myurl = this.url + "/manageprogsetupClone/GetAssignedPCK.htm" ;
    let body={};
    return  this.httpclient.get(myurl,{headers,responseType: 'text',params});
  }

  getInstructorsToAssign(params:HttpParams)
  {
    var myurl ="";
    let headers: HttpHeaders= new HttpHeaders();
    headers=headers.set('format', 'format');
    myurl = this.url + "/manageprogsetupClone/getInstructorsToAssign.htm";		
    //myurl = this.url + "/manageprogsetupClone/getUnassignedInstructors.htm";		
    let body={};
    return  this.httpclient.get(myurl,{headers,responseType: 'text',params});     
  }

  assignCourseInstructor(params:HttpParams)
  {
    var myurl ="";
    let headers: HttpHeaders= new HttpHeaders();
    headers=headers.set('format', 'format');
    myurl = this.url + "/manageprogsetupClone/InsertFirstApprover.htm";		
    let body={};
    return  this.httpclient.post(myurl,body,{headers,params:params,responseType: 'text'});
  }

  unassignInstructor(params:HttpParams)
  {
    var myurl ="";
    let headers: HttpHeaders= new HttpHeaders();
    headers=headers.set('format', 'format');
    myurl = this.url + "/manageprogsetupClone/UnassingInstructor.htm";		
    let body={};
    return  this.httpclient.post(myurl,body,{headers,params:params,responseType: 'text'});
  }

  /** Log a service message with the MessageService */
  public log(message: string) {
    this.messagesrv.clear();
    this.messagesrv.add(`User Service: ${message}`);
  }

  public clear() {
    this.messagesrv.clear();
    }
  

}