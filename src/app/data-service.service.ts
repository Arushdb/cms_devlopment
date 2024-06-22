import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { MessageService } from 'src/app/services/message.service'

@Injectable({
  providedIn: 'root'
})
export class DataServiceService {
  url:string;
  dataUrl:string;
  application="CMS";

  public dataStore:any[]=[];
  params: any;
  pck:any;
  entity:any;
  saveData(data:any){
    console.log('Saving data', data);
    this.dataStore.push(data)
  }
  getData(){
    return this.dataStore;
  }

  constructor(private httpclient: HttpClient,
    private messagesrv:MessageService
) { 
    this.url=environment.url;
  }
  // fetchData(): Observable<any> {


  //   this.dataUrl=this.url+ '/awardsheet/getCourseList.htm'
  //   return this.httpclient.get<any>(this.dataUrl);
  // }


  fetchData(params:HttpParams,myparam): Observable<any>{


    var myurl =this.url+ "/awardsheet/getCourseList.htm";
    let headers: HttpHeaders= new HttpHeaders();

    headers=headers.set('format', 'format');
    console.log("The url is ",this.url);
    console.log("params are :",params);
    
    myurl = this.url+myparam.method ;
    console.log("My url is ",myurl);
   // headers=headers.set('format', 'format');// format the response data from xml to json
    
    return  this.httpclient.get(myurl,{headers,responseType:'text',params});

  }
  setAwardSheet(params:any): Observable<any>{


    var myurl =this.url+ '/coursegradelimitpercourse/getCourseGradeLimit.htm';
    let headers: HttpHeaders= new HttpHeaders();

    headers=headers.set('format', 'format');
    let httpParams = new HttpParams()
      .set('courseCode', params.courseCode)
      .set('semesterStartDate', params.semesterStartDate)
      .set('semesterEndDate', params.semesterEndDate)
      .set('displayType', params.displayType)
      .set('totalMarks', params.totalMarks)
      .set('marksEndSem', params.marksEndSem)
      .set('sessionStartDate', params.sessionStartDate)
      .set('sessionEndDate', params.sessionEndDate)
      .set('programCourseKey',params.programCourseKey)
      .set('entityId',params.entityId)

    // console.log("The url is ",this.url);
    // console.log("params are :",params);
    
    // console.log("My url is ",myurl);
   // headers=headers.set('format', 'format');// format the response data from xml to json
    
    return  this.httpclient.get(myurl,{headers,responseType:'text',params:httpParams});
  }
  addGradeLimits(params:any): Observable<any>{


    var myurl =this.url+ '/coursegradelimitpercourse/insertCourseGrade.htm';
    let headers: HttpHeaders= new HttpHeaders();

    headers=headers.set('format', 'format');
    let httpParams = new HttpParams()
      .set('courseCode', params.courseCode)
      .set('semesterStartDate', params.semesterStartDate)
      .set('semesterEndDate', params.semesterEndDate)
      .set('displayType', params.displayType)
      .set('totalMarks', params.totalMarks)
      .set('marksEndSem', params.marksEndSem)
      .set('sessionStartDate', params.sessionStartDate)
      .set('sessionEndDate', params.sessionEndDate)
      .set("internalActive",params.internalActive)
      .set('programCourseKey',params.programCourseKey)
      .set('lowers',params.lowers)
      .set('grades',params.grades)
      .set('entityId',params.entityId)



    console.log("The url is ",this.url);
    console.log("params are :",params.toString());
    
    // console.log("My url is ",myurl);
   // headers=headers.set('format', 'format');// format the response data from xml to json
    
    return  this.httpclient.get(myurl,{headers,responseType:'text',params:httpParams});
  }
  setParams(params: any) {
    this.params = params;
  }

  getParams(): any {
    return this.params;
  }
  setPckAndEntity(pck: string, entity: string) {
    this.pck = pck;
    this.entity = entity;
  }
  getPckAndEntity(): { pck: string, entity: string } {
    return { pck: this.pck, entity: this.entity };
  }
  setHttpParams(params: any): HttpParams {
    let httpParams = new HttpParams();
    for (const key in params) {
      if (params.hasOwnProperty(key)) {
        httpParams = httpParams.set(key, params[key]);
      }
    }
    return httpParams;
  }
  public log(message: string) {
    this.messagesrv.clear();
  this.messagesrv.add(`User Service: ${message}`);
  }


  
}
 