import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {NgForm,} from '@angular/forms';
import{UserService} from '../services/user.service'
import { HttpParams } from '@angular/common/http';

import { map } from 'rxjs/operators';
import * as xml2js from 'xml2js';
import { ILogin } from 'src/app/interfaces/login';  
import { AuthService } from '../services/auth.service' 



@Component({
  selector: 'signonform',
  templateUrl: './signonform.component.html',
  styleUrls: ['./signonform.component.css']
})
export class SignonformComponent  {

  
   public sts:String ="ACT";
   message: string;  
   returnUrl: string;  
  constructor(private router:Router,
    private userservice:UserService,
    private authService: AuthService ) { }
  ngOnInit() {  
 
 this.returnUrl = '/dashboard';  
 this.authService.logout();  
 }  
  model: ILogin = { userid: "admnin", password: "admin@123" }  ;
  
   main(form):void {
    const params = new HttpParams()
    .set('userName',form.inputUser)
    .set('password', form.inputPassword)
    .set('application','CMS');

    var session:WindowSessionStorage ;
    

    // var data= null;
    // var sts:String ="";
   

    // let urlSearchParams = new URLSearchParams();
    // urlSearchParams.append('userName', form.inputUser);
    // urlSearchParams.append('password', form.inputPassword);
    // urlSearchParams.append('application', 'CMS');
    // let body = urlSearchParams.toString();
    this.userservice.startlogin(params).subscribe(res=>{
     // this.router.navigate(['\dashboard']);
     
     let  data= null;
        xml2js.parseString( res, function (err, result){
        data = result;     
       
               });
       
      //console.log("Arush"+data.loginInfo.loginInfo[0].status);
      
      this.sts =data.loginInfo.loginInfo[0].status;

  //     if (form.inputUser == this.model.userid && form.inputpassword == this.model.password) {  
  //       console.log("Login successful");  
  //       //this.authService.authLogin(this.model);  
  //       localStorage.setItem('isLoggedIn', "true");  
  //       localStorage.setItem('token', form.inputUser);  
  //       this.router.navigate([this.returnUrl]);  
  //    }  
  // else {  
  //    this.message = "Please check your userid and password";  
  //    }  
         
      if(this.sts=="ACT"){
        console.log("Login successful"); 
        localStorage.setItem('isLoggedIn', "true");  
        localStorage.setItem('token', form.inputUser); 
        this.router.navigate(['\dashboard']);
        }else{
          this.message = "Please check your userid and password";  
          console.log("In else condition if loop "+data);
          this.router.navigate(['\login']);
          alert(this.sts);
        }

       });
        
      
  
    
  }


  

   

}
