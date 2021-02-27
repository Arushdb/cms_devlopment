import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';  
import { map } from 'rxjs/operators';

import { AuthService } from 'src/app/services/auth.service'; 

type MyType = {
  displayname:string;
  route:string;
  children:MyType;
}
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  id: string;  
title ="Dayalbagh Educational Institute";
  public menus:MyType[]=[];
constructor(private router: Router, public authService: AuthService,
  public _activatedRoute: ActivatedRoute) { }  

ngOnInit() {  
  this.id = localStorage.getItem('id');  
  //console.log(this.id);  

  //console.log(this.router.getCurrentNavigation());

  //this.state$ = this.activatedRoute.paramMap
      // .pipe(map(() => {
      //   console.log("Hello in dasshboard ngoninit method");
      //   console.log(window.history.state);
      // }  
      // ));
      let data = null;
      this._activatedRoute.queryParams.subscribe(params => {
        //console.log(params.menus);
        
        this.menus =JSON.parse(params.menus);
        //this.menus.push(data);
        //let mymenu = params["menu"];
        //this.menus.push(data);
        //console.log(this.menus);
      });
}  
logout() {  
  //console.log('logout in dashboard');  
  this.authService.logout();  
  this.router.navigate(['/login']);  
}  




}
