import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ILogin } from '../interfaces/login'; 

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  logout() :void { 
      
    localStorage.setItem('isLoggedIn','false');    
    localStorage.removeItem('token');    
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
