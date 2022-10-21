import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { MessageService } from './message.service';

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  url:string;
  application="CMS";
  constructor(private httpclient:HttpClient,
    private messagesrv:MessageService) { 
      this.url=environment.url;
    }


    getStudentYearlyAverage(form){
      debugger;
      var myurl =this.url+"/studentMaster/getstudentAverage.htm";
      let headers: HttpHeaders= new HttpHeaders();
      headers=headers.set('format', 'format');// format the response data from xml to json
      let param:HttpParams= new HttpParams();
      
      param=param
                 .set('rollnumber',form.rollnumber) 
                 .set('yeargroup',form.yeargroup);

           console.log("Arush Param",param);
      return  this.httpclient.get(myurl,{headers,params:param,responseType: 'text'});

    }

public log(message: string) {
      this.messagesrv.clear();
    this.messagesrv.add(`Student Service: ${message}`);
    }
  
    public clear() {
      this.messagesrv.clear();
      }
}
