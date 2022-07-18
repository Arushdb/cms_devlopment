import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { MessageService } from './message.service';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EntityService {
  url:string;
  application="CMS";
  constructor(private httpclient:HttpClient,
    private messagesrv:MessageService) { 
      this.url=environment.url;
    }
  
   

    getEntities(){
      
      var myurl =this.url+"/revertResultProcess/getEntities.htm";
      let headers: HttpHeaders= new HttpHeaders();
      headers=headers.set('format', 'format');// format the response data from xml to json
      
      return  this.httpclient.get(myurl,{headers,responseType: 'text'});

    }
    public log(message: string) {
      this.messagesrv.clear();
    this.messagesrv.add(`ProgramService: ${message}`);
    }
  
    public clear() {
      this.messagesrv.clear();
      }
    
}
