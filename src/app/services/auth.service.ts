import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ILogin } from '../interfaces/login'; 
import { SubscriptionContainer } from '../shared/subscription-container';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  subs = new SubscriptionContainer();
  login_params: HttpParams ;

  constructor(private userservice:UserService,) {
    this.login_params =
				new HttpParams()
				.set('application','CMS')
				.set('angular_application','ANG')
				.set('requestFrom','ANGULAR')

   }

  logout() :void { 
      
    localStorage.setItem('isLoggedIn','false');    
    localStorage.removeItem('token');  
    
    let  myparam ={
			method:'/login/setLogout.htm',
			xmltojs:'Y'
			};

			let  data= null;
			this.subs.add=this.userservice.getdata(this.login_params,myparam).subscribe(res=>{
			
			data = JSON.parse(res);
      console.log(res,data);
			
			});


    
    }    


    login(credentials){
     


    }

    isLoggedIn(){
      
      let token = localStorage.getItem("token");
 
      let jwthelper= new JwtHelperService();

      if(!token)
       return false;

      let expirationDate =jwthelper.getTokenExpirationDate(token);
      let isExpired= jwthelper.isTokenExpired(token);
      // console.log(expirationDate);
      // console.log(isExpired);

      return !isExpired;

    }

}
