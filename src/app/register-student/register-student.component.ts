import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import{RegistrationService} from '../services/registration.service'

@Component({
  selector: 'register-student',
  templateUrl: './register-student.component.html',
  styleUrls: ['./register-student.component.css']
})
export class RegisterStudentComponent implements OnInit {

  
  constructor(private router:Router,
    private registrationservices:RegistrationService,
    route:ActivatedRoute
    ) { 

    

  }

  ngOnInit(): void {
   
  }

  gettencode(){
    
   
    const params = new HttpParams()
    .set('userName','190234')
   //.set('password', form.inputPassword);
      .set('application','CMS');
     // .set('session',String(session));
      

      console.dir("in tencode"+params);
 
     this.registrationservices.gettencodes(params).subscribe(res=>{
       console.log(res);
     });
  }

  


  rowData=[];
}
