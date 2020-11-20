import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {NgForm} from '@angular/forms';
import{UserService} from '../services/user.service'
import { HttpHeaders, HttpParams } from '@angular/common/http';


import * as xml2js from 'xml2js';

import { AuthService } from '../services/auth.service' 
import {CookieService} from 'ngx-cookie-service'
import { JsonPipe } from '@angular/common';
import { AppError } from '../AppErrors/app-error';
import { NotFoundError } from '../AppErrors/not-found-error';
import { MessageService } from '../services/message.service';



@Component({
  selector: 'signonform',
  templateUrl: './signonform.component.html',
  styleUrls: ['./signonform.component.css']
})
export class SignonformComponent  {

  
   public sts:string ="ACT";
   message: string;  
   returnUrl: string;  
   userGroupId:string;
   maxLogins:string;
    params:HttpParams ;
    headers:HttpHeaders;
  constructor(private router:Router,
    private userservice:UserService,
    private authService: AuthService ,
    private cookieservice:CookieService,
    ) { }
  ngOnInit() {  
 
 this.returnUrl = '/dashboard';  
 this.authService.logout();  
 
 }  
  
   main(form):void {
     this.params = new HttpParams()
    .set('userName',form.inputUser)
    .set('password', form.inputPassword)
    .set('application','CMS')
    .set('method','/login/loginProcedureStart.htm' )
    .set('xmltojs','Y');

  
    // var data= null;
    // var sts:String ="";
   

    // let urlSearchParams = new URLSearchParams();
    // urlSearchParams.append('userName', form.inputUser);
    // urlSearchParams.append('password', form.inputPassword);
    // urlSearchParams.append('application', 'CMS');
    // let body = urlSearchParams.toString();
    let  data= null;
    this.userservice.getdata(this.params).subscribe(res=>{
    //  alert(res);
    //this.userservice.startlogin(this.params).subscribe(res=>{
     // this.router.navigate(['\dashboard']);
    //  console.log("in response start login",JSON.parse(res));
     
      data = JSON.parse(res);
    //     xml2js.parseString( res, function (err, result){
    //     data = result;     
    //    let data=null;
    // xml2js.parseString( res , function (err, result){ 
    //   data =result;
                 
    // });       
       
      console.log("inside startlogin result"+data.loginInfo.loginInfo[0].userGroupId);
      
      this.sts =data.loginInfo.loginInfo[0].status;
      this.userGroupId=data.loginInfo.loginInfo[0].userGroupId ;
      this.maxLogins = data.loginInfo.loginInfo[0].maxLogins;

   
         
      if(this.sts=="ACT"){
        console.log("Login successful",this.maxLogins);


       this.params= this.params.append('userGroupId',this.userGroupId);
       this.params=this.params.append('maxLogins',this.maxLogins);

       this.params=this.params.append('method','/login/getLoginDetails.htm');
     
       this.userservice.getdata(this.params).subscribe(res=>{ 
       //this.userservice.getLoginDetails(this.params).subscribe(res=>{
        res= JSON.parse(res);
        let cook:string =this.cookieservice.get('JSESSIONID'); 
        console.log("cookies",cook);

        this.params=this.params.append('method','/login/generateMenu.htm');
     
        this.userservice.getdata(this.params).subscribe(res=>{ 


      // this.userservice.getmenus(this.params).subscribe(res=>{
        //res= JSON.parse(res);
        localStorage.setItem('isLoggedIn', "true");  
        localStorage.setItem('token', form.inputUser); 

        
       this.router.navigate(['\dashboard']);

       });
       
          });

            
        }else{
          this.message = "Please check your userid and password";  
          console.log("In else condition if loop "+data);
          this.router.navigate(['\login']);
          alert(this.sts);
        }

      },
      (error:AppError)=>{
       if(error instanceof NotFoundError){
        this.userservice.log("Server not found");
        alert("Server not found");

       }
         else{
          this.userservice.log("Hello Arush :An unexpected Error");
          alert("Hello Arush :An unexpected Error");
         }
        

      }
      
      
      
      );
        
      
  
    
  }


  

   

}
