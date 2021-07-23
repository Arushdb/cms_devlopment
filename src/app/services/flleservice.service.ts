import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FlleserviceService {

  url:string;
  constructor(private httpclient:HttpClient,
             
    
    ) {
  this.url=environment.url;


    }
// to down load Report based on Aadhar Number or (Phone and DOB)
getFileName(params:HttpParams,myparam){
      var myurl ="";
    let headers: HttpHeaders= new HttpHeaders();
    
    if(myparam.xmltojs=="Y"){
      headers=headers.set('format', 'format');// format the response data from xml to json
    }else{
      headers=headers.set('format', 'None');// format the response data from xml to json
    } 
    myurl = this.url+'/registrationreport/getFileName.htm' ;

   return  this.httpclient.get(myurl,{headers,responseType: 'text',params});


}

downloadFile(url) {
  return this.httpclient.get(url, {responseType: 'blob'});
}

}
