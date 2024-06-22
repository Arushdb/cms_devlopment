///  Author :Piyush Singh
//   Date Created: 14 jun 2024
//   Function : Service file for course evaluation Component


import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams,HttpClientModule } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import {  map } from 'rxjs/operators';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class CourseevaluationService {
  
  // private selectedRowData: any;
  private xmlUrl = 'assets/template.xml'; //  path to  XML file
  url:string;
  application="CMS";
  constructor(private httpclient: HttpClient,private userservice: UserService,) {  this.url=environment.url;}
  
  
  // for getting assigned courses

  getProgramCourses():Observable<any>{                      
    var myUrl=this.url+'/instructorCourseEvaluationComponent/getProgramCourse.htm';    //--api for getting courses
    let headers: HttpHeaders= new HttpHeaders();
    headers=headers.set('format', 'format');// format the response data from xml to json
    let param:HttpParams= new HttpParams()
    return  this.httpclient.get(myUrl,{headers,params:param,responseType: 'text'});
    
  }


//   for getting Template assigned to the courses
getCecListForTemplate(params): Observable<any>{                      
  var myUrl=this.url+'/instructorCourseEvaluationComponent/getCecListForTemplate.htm';     // --api for templates
  let headers: HttpHeaders= new HttpHeaders();
  headers=headers.set('format', 'format');// format the response data from xml to json
  let param:HttpParams= new HttpParams()
  //  param=param
  .set('coursecode', params.coursecode)
  .set('programid', params.programid)
  .set('semestercode', params.semestercode);
  return  this.httpclient.get(myUrl,{headers,params:param,responseType: 'text'});
}

// for fetching templates name from T1 component from xml directly    xml path --assets/template.xml
getTemplateNames(): Observable<string[]> {
  return this.httpclient.get(this.xmlUrl, { responseType: 'text' }).pipe(
    map((xmlString) => {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlString, 'application/xml');
      const templates = xmlDoc.getElementsByTagName('t1');
      const templateNames: string[] = [];
      for (let i = 0; i < templates.length; i++) {         //creating loop for template name
        const name = templates[i].getAttribute('name');
        if (name) {
          templateNames.push(name);
        }
      }
      return templateNames;
    }),
  );
}



// fetch and parse course templates from xml file directly            xml path --assets/template.xml //defined above
getCourseTemplate(name: string): Observable<any> {
  return this.httpclient.get(this.xmlUrl, { responseType: 'text' }).pipe(
    map((xmlString) => {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlString, 'application/xml');
      const template = xmlDoc.querySelector(`t1[name="${name}"]`);
      // to parse the components inside the selected template
      if (template) {
        const totalElement = template.querySelector('total');                 // for template Total marks
        const total = totalElement ? totalElement.textContent : '0';
        const components = Array.from(template.getElementsByTagName('component')).map(comp => {
          return {
            group: comp.getAttribute('group'),
            compName: comp.getAttribute('compName'),
            fullName: comp.getAttribute('fullName'),
            numberOfComponents: comp.getAttribute('numberOfComponents'),
            maxMarks: comp.getAttribute('maxMarks'),
            weightage: comp.getAttribute('weightage'),
            rule: comp.getAttribute('rule'),
            componentType:comp.getAttribute('componentType'),
          };
        });
        return { name: template.getAttribute('name'), components ,total};
        }
    })
  );
  
}

//function for assigning template
getTemplateUpdate(params): Observable<any> {
  const myUrl=this.url+'/instructorCourseEvaluationComponent/setDefaultComponentsFromTemplate.htm';
  let headers: HttpHeaders= new HttpHeaders();
  headers=headers.set('format', 'format');// format the response data from xml to json
  let param:HttpParams= new HttpParams()
  .set('course',params.coursecode)
  .set('programid', params.programid)
  .set('semester', params.semestercode)
  .set('group', params.group)
  .set('compName', params.compName)
  .set('fullName', params.fullName)
  .set('numberOfComponents', params.numberOfComponents)
  .set('maxMarks', params.maxMarks)
  .set('rule', params.rule)
  .set('weightage', params.weightage)
  .set('compType', params.componentType);
  
  return  this.httpclient.get(myUrl,{headers,params:param,responseType:'text'}).pipe(
  map((res:any)=>{
    res=JSON.parse(res);
  let resArray=res.Message.result;
  //console.log('resArray',resArray);
  let isSuccess=resArray&&resArray[0]==="true";
 return isSuccess;
  }));
}

//calling api for course max marks
getMaxMarks(params){                      
  var myUrl=this.url+'/instructorCourseEvaluationComponent/getCourseMaxMarks.htm';    
  let headers: HttpHeaders= new HttpHeaders();
  headers=headers.set('format', 'format');// format the response data from xml to json
  let param:HttpParams= new HttpParams()
   .set('coursecode',params.coursecode)
  return  this.httpclient.get(myUrl,{headers,params:param,responseType: 'text'});
  
}

}
