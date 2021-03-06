import { Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';


import{UserService} from 'src/app/services/user.service';
import { HttpHeaders, HttpParams } from '@angular/common/http';

//import { AuthService } from '../services/auth.service' 
import { AuthService } from 'src/app/services/auth.service' ;

import { isUndefined } from 'typescript-collections/dist/lib/util';
import { SubscriptionContainer } from 'src/app/shared/subscription-container';
import { environment } from 'src/environments/environment';
import { SelectorListContext } from '@angular/compiler';
import { getRtlScrollAxisType } from '@angular/cdk/platform';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { CustomComboboxComponent } from 'src/app/shared/custom-combobox/custom-combobox.component';
import { MyItem } from 'src/app/interfaces/my-item';
import { formatCurrency } from '@angular/common';
import { NgForm } from '@angular/forms';


interface User {
	[index: string]: {
		
			userGroupId: string;
			lastLogin: string;
			maxLogins: string;
			status:string;
			userId:string;
			universityId:string;
			
			userGroupName:string;
			userName:string;
			universityName:string;

    }
}

@Component({
  selector: 'signonform',
  templateUrl: './signonform.component.html',
  styleUrls: ['./signonform.component.css']
})
export class SignonformComponent implements OnDestroy  {

	@ViewChild('form') public userFrm: NgForm;
	//@ViewChild('CustomComboboxComponent') custcombo: CustomComboboxComponent;
  
			public sts:string ="ACT";
			message: string="";  
			returnUrl: string;  

			
		
			token: any;
			public combodata :MyItem []=[];
		
		

		
			subs = new SubscriptionContainer();
			login_params: HttpParams ;
			userid:string="";
			env:boolean=false;
			combolabel: string;
			combowidth: string;
			optionselected: boolean=false;
			
			constructor(private router:Router,
			private userservice:UserService,
			private authService: AuthService ,
			private elementRef:ElementRef,
			public dialog: MatDialog
			
			) {
				this.login_params =
				new HttpParams()
				.set('application','CMS')
				.set('angular_application','ANG')
				.set('requestFrom','ANGULAR')

                 if(environment.production)
				     this.env=true;
					 else
					 this.env=false;
				

			 }
			
  
  

			


		ngOnInit() 
		{  
			
			this.userservice.clear();
			this.returnUrl = '/dashboard';  
					
		}  
	 
		ngOnDestroy(): void {
			this.subs.dispose();
			this.elementRef.nativeElement.remove();
		   
		  }
		
 
//On click of login button
 		Login(form)
		{
	this.message=""; 
	this.optionselected=false;
	 let user =window.btoa(form.inputUser);
	 let pwd =window.btoa(form.inputPassword);
	 this.userid=form.inputUser;
	// console.log(user,pwd);

			this.login_params = this.login_params
			//.set('userName',form.inputUser)
			.set('userName',user)
			.set('password', pwd)
			//.set('password', form.inputPassword)
			
			;
			
	
			this.loginProcedureStart(this.login_params);
    
		}

		loginProcedureStart(params)
		{
			let  myparam ={
			method:'/login/loginProcedureStart.htm',
			xmltojs:'Y'
			};

			let  data= null;
			this.subs.add=this.userservice.getdata(this.login_params,myparam).subscribe(res=>{
			
				
			data = JSON.parse(res);
			//this.getRolefromuser(data);

			this.LoginRoleServiceResult(data);
			},err=>{
                
				//if (err.originalError.status=="0"){
					this.message =err.originalError.statusText;
					//console.log("in error",err.originalError);
				//}
				this.sts="INA";
				this.subs.dispose();
				return;
			}	
			
			
			);
		}

 	


		LoginRoleServiceResult(res)
		{
			//console.log(res);
			let roles:any []=res.loginInfo.loginInfo;
			
			
			if(isUndefined(res.loginInfo.loginInfo)) {
				roles=[];
				this.throwerror();
				return;
			}
		
			
			if (roles.length>1)
			
			{
				
				this.login_params=this.login_params.set("maxLogins",res.loginInfo.loginInfo[0].maxLogins );			
			   this.login_params=this.login_params.set("date",new Date().toString());
			   this.combodata=[];
			   this.combolabel = "Select Role" ;
        		this.combowidth = "50%";

				roles.forEach(item=>{
					this.combodata.push({id:item.userGroupId,label:item.userGroupName.toString()});
					this.sts=item.status;
				});


				
					// if (String(item.userGroupId).toString()==="INS" && String(roles[0].status).toString()==="ACT"){
					// 	this.login_params=this.login_params.set("userGroupId","INS");
					// 	this.getLoginInfoService();
						
					// }
				
			}
			else if(roles.length===1)
			{
				this.login_params=this.login_params.set("maxLogins",res.loginInfo.loginInfo[0].maxLogins );			
			this.login_params=this.login_params.set("date",new Date().toString());
				this.login_params=this.login_params.set("userGroupId",res.loginInfo.loginInfo[0].userGroupId);
							
				if (String(roles[0].status).toString()==="ACT"){
					
					this.getLoginInfoService();
					}else{
						this.throwerror();
  						return;
					}
			
			}
			else
			{
				this.throwerror();
  				return;
			}
			;
  
		}

	throwerror(){
		this.sts="";
		this.message="Invalid login";
		this.subs.dispose();
		this.combodata=[];
		this.userFrm.reset();
	}

	OnOptionselected(obj){
		
		console.log(obj);
		this.optionselected = true;
        if(this.sts=="ACT"){

		this.login_params=this.login_params.set("userGroupId",obj.id);
	
	} else{
		this.throwerror();
		  return;

	} 
	
	  }
   
		Onconfirm(){
		
			if(this.sts=="ACT"){
				
				this.getLoginInfoService();
			} else{
				this.throwerror();
				  return;
		
			} 
		}

		getLoginInfoService()
		{
			let  myparam ={
				method:'/login/getLoginDetails.htm',
				xmltojs:'Y'
				};

			let  data= null;

			this.subs.add=this.userservice.getdata(this.login_params,myparam).subscribe(res=>{
			
			data = JSON.parse(res);
			
			
			if (isUndefined((data.loginInfo.loginInfo))){
			    //debugger ;
				this.throwerror();
				return;
			}
			else
			{
				this.loginInfoResultHandler(data)
			};

			});
	

		}


 		loginInfoResultHandler(res)
		{

	  	
			
			let info:any;
			info =res.loginInfo.loginInfo[0];
			if(!(isUndefined(info))){
				this.login_params=this.login_params.set("userGroupName",info.userGroupName);
				this.token=info.token;
				//console.log(this.login_params);
				localStorage.setItem('isLoggedIn', "true");  
				localStorage.setItem('token', this.token); 
				localStorage.setItem('id', this.userid); 

				this.menuHttpService(this.login_params);
			

			}else{
				
				this.throwerror();
				return;
			}
			
			
			

		}

		

		menuHttpService(params)
		{

			let  myparam ={
				method:'/login/generateMenu.htm',
				xmltojs:'N'
				};

			let  data= null;
			console.log(params);
			this.subs.add=this.userservice.getdata(params,myparam).subscribe(res=>{
			console.log(res);
			data = JSON.parse(res);
			//console.log(data);

			this.menuHttpServiceResultHandler(data);
			});

		}

		 menuHttpServiceResultHandler(res):void
		{
	
			let navigationExtras: NavigationExtras = {
				queryParams: {
					"menus": JSON.stringify(res)
				}
			};
		
			
			//localStorage.setItem('id', this.login_params.get('userName')); 

			this.router.navigate(['\dashboard'],navigationExtras);

		}

		

}

