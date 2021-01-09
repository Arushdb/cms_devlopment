import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {NgForm} from '@angular/forms';
import{UserService} from '../services/user.service'
import { HttpHeaders, HttpParams } from '@angular/common/http';




import { AuthService } from '../services/auth.service' 
import {CookieService} from 'ngx-cookie-service'
import { JsonPipe } from '@angular/common';
import { AppError } from '../AppErrors/app-error';
import { NotFoundError } from '../AppErrors/not-found-error';
import { MessageService } from '../services/message.service';
import * as Collections from 'typescript-collections';
import {appProperties} from '../appProperties'
import { isUndefined } from 'typescript-collections/dist/lib/util';


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
export class SignonformComponent  {

  
   public sts:string ="ACT";
   message: string;  
   returnUrl: string;  
   userGroupId:string;
   maxLogins:string;
    httpparams:HttpParams ;
  
    headers:HttpHeaders;

    roleSelectionAllowed: boolean;
  constructor(private router:Router,
    private userservice:UserService,
    private authService: AuthService ,
    private cookieservice:CookieService,
    ) { }
  ngOnInit() {  
 
 this.returnUrl = '/dashboard';  
 this.authService.logout();  
 
 }  
  
  //  main(form):void {
  //    this.httpparams = new HttpParams()
  //   .set('userName',form.inputUser)
  //   .set('password', form.inputPassword)
  //   .set('application','CMS');


  //   let  myparam ={
  //                 method:'/login/loginProcedureStart.htm',
  //                 xmltojs:'Y'
  //                 };
    
  
  //   // var data= null;
  //   // var sts:String ="";
   

  //   // let urlSearchParams = new URLSearchParams();
  //   // urlSearchParams.append('userName', form.inputUser);
  //   // urlSearchParams.append('password', form.inputPassword);
  //   // urlSearchParams.append('application', 'CMS');
  //   // let body = urlSearchParams.toString();
  //   let  data= null;
  //   this.userservice.getdata(this.httpparams,myparam).subscribe(res=>{
  //   //  alert(res);
  //   //this.userservice.startlogin(this.httpparams).subscribe(res=>{
  //    // this.router.navigate(['\dashboard']);
  //   //  console.log("in response start login",JSON.parse(res));
     
  //     data = JSON.parse(res);
  //   //     xml2js.parseString( res, function (err, result){
  //   //     data = result;     
  //   //    let data=null;
  //   // xml2js.parseString( res , function (err, result){ 
  //   //   data =result;
                 
  //   // });       
       
  //     console.log("inside startlogin result"+data.loginInfo.loginInfo[0].userGroupId);
      
  //     this.sts =data.loginInfo.loginInfo[0].status;
  //     this.userGroupId=data.loginInfo.loginInfo[0].userGroupId ;
  //     this.maxLogins = data.loginInfo.loginInfo[0].maxLogins;

   
         
  //     if(this.sts=="ACT"){
  //       console.log("Login successful",this.maxLogins);


  //      this.httpparams= this.httpparams.append('userGroupId',this.userGroupId);
  //      this.httpparams=this.httpparams.append('maxLogins',this.maxLogins);

  //      //this.httpparams=this.httpparams.append('method','/login/getLoginDetails.htm');
  //      myparam.method ='/login/getLoginDetails.htm';
  //      this.userservice.getdata(this.httpparams,myparam).subscribe(res=>{ 
  //      //this.userservice.getLoginDetails(this.httpparams).subscribe(res=>{
  //       res= JSON.parse(res);
  //       let cook:string =this.cookieservice.get('JSESSIONID'); 
  //       console.log("cookies",cook);

  //       //this.httpparams=this.httpparams.append('method','/login/generateMenu.htm');
  //       myparam.method ='/login/generateMenu.htm';
  //       this.userservice.getdata(this.httpparams,myparam).subscribe(res=>{ 


  //     // this.userservice.getmenus(this.httpparams).subscribe(res=>{
  //       //res= JSON.parse(res);
  //       localStorage.setItem('isLoggedIn', "true");  
  //       localStorage.setItem('token', form.inputUser); 

        
  //      this.router.navigate(['\dashboard']);

  //      });
       
  //         });

            
  //       }else{
  //         this.message = "Please check your userid and password";  
  //         console.log("In else condition if loop "+data);
  //         this.router.navigate(['\login']);
  //         alert(this.sts);
  //       }

  //     },
  //     (error:AppError)=>{
  //      if(error instanceof NotFoundError){
  //       this.userservice.log("Server not found");
  //       alert("Server not found");

  //      }
  //        else{
  //         this.userservice.log("Hello Arush :An unexpected Error");
  //         alert("Hello Arush :An unexpected Error");
  //        }
        

  //     }
      
      
      
  //     );
        
      
  
    
  // }


  roles = new Collections.Set<User>();
  //roles = new Collections.arrays[];

 universityId:String;
 userId:string;
 
 userGroupName:string;
urlPrefix:string;
 userName:string;
 password:string;
 application:string;
 universityName:string;
 startDate:string;
 endDate:string;
 expiryStatus:string;
 func:Function;
 params: HttpParams;




 unloadMethod():string{
//	Alert.show("Inside New Logout");

	//setLogoutService.send([new Date]);
	return "Logout";
}

//On click of login button
 Login(form)
{
	// if(Validator.validateAll([userNameValidator,passwordValidator,emailvalidator]).length==0)
	// {
   
		console.log(appProperties['accountDissable']);

		this.params = new HttpParams()
		.set('userName',form.inputUser)
		.set('password', form.inputPassword)
		.set('application','CMS');

	

		
				this.loginRoleService(this.params);
             


	//}
	//else{
	//	userPasswordLabel.visible=true;
	//}
}

loginRoleService(params){
	let  myparam ={
		method:'/login/loginProcedureStart.htm',
		xmltojs:'Y'
		};

let  data= null;
this.userservice.getdata(this.params,myparam).subscribe(res=>{

data = JSON.parse(res);

this.LoginRoleServiceResult(data)
});
}
 requestPasswordServiceResult(ResultEvent){
	
	
	//Alert.show(event.result.response.toString());
}

// public function requestPasswordServiceFault(event:FaultEvent):void{
// 	Alert.show(event.fault.toString());
	
// }
// public function onRoleChange():void   //added by Jyoti on 31 Jul 2020
// {
// 		loaderCanvas.removeAllChildren();
//  		selectRolectPopup=RoleSelector(PopUpManager.createPopUp(this,RoleSelector,true));
// 				selectRolectPopup.roleCombo.dataProvider=rolesXML.loginInfo.userGroupName;
// 				selectRolectPopup.roleCombo.selectedIndex=-1;
// 				selectRolectPopup.dataXml=rolesXML;
// 				selectRolectPopup.refFunction=getLoginDetails;
// 				PopUpManager.centerPopUp(selectRolectPopup);
// }

LoginRoleServiceResult(res){
  //rolesXML = event.result as XML;

  console.log("inside startlogin result"+res.loginInfo.loginInfo[0].userGroupId);
      
  //     this.sts =data.loginInfo.loginInfo[0].status;
  //     this.userGroupId=data.loginInfo.loginInfo[0].userGroupId ;
  //     this.maxLogins = data.loginInfo.loginInfo[0].maxLogins;
  
  console.log(res);
	this.roles.clear() ;//removeAll();
	for ( var obj of  res.loginInfo.loginInfo){
		//this.roles.addItem({userGroupId:obj.userGroupId,lastLogin:obj.lastLogin,maxLogins:obj.maxLogins,status:obj.status});
		this.roles.add({userGroupId:obj.userGroupId,lastLogin:obj.lastLogin,maxLogins:obj.maxLogins,status:obj.status});
		
  }
  
  console.log(this.roles);
  console.log(this.roles.toArray());
  var msg=this.roles.toArray();
  var str;
  this.roles.forEach(item=>{
    str=item.status;
    console.log(item.status)
  });
	//if(this.roles.length>0){
    // for(let entry of this.roles){

    // }
	if(this.roles.size()>0){
    // var str:String=this.roles['status'];
    // console.log(str);
		// var msg:Array<string>=str.split("-");	
		
		localStorage.setItem('isLoggedIn', "true");  
    localStorage.setItem('token', res.userName); 
		//if(msg[0]=="ACT"){
		if(str=="ACT"){
      console.log("inside login");
			if(this.roles.size() > 1){
			//if(this.roles.size() > 1){
        this.roleSelectionAllowed = true;		//added by Jyoti on 31 Jul 2020
        console.log("inside login multiple roles");
				
				// loginDetailsCanvas.visible=false;
				// selectRolectPopup=RoleSelector(PopUpManager.createPopUp(this,RoleSelector,true));
				// selectRolectPopup.roleCombo.dataProvider=rolesXML.loginInfo.userGroupName;
				// selectRolectPopup.roleCombo.selectedIndex=-1;
				// selectRolectPopup.dataXml=rolesXML;
				// selectRolectPopup.refFunction=getLoginDetails;
				// PopUpManager.centerPopUp(selectRolectPopup);
			}else if(this.roles.size() == 1){
				this.roleSelectionAllowed = false;  //added by Jyoti on 31 Jul 2020
				this.getLoginDetails(res);
			}
		}
		//else if(msg[0]=="DIS"){
		else if(str=="DIS"){
			//Alert.show(commonFunction.getMessages('accountDissable'),commonFunction.getMessages('info'),null,null,null,infoIcon);
			console.log(appProperties['accountDissable']);
			this.userservice.log('account is Dissabled');
			//reset();
		}
		//else if(msg[0]=="INA"){
		else if(str=="INA"){
			//Alert.show(commonFunction.getMessages('accountInactive'),commonFunction.getMessages('info'),null,null,null,infoIcon);
			this.userservice.log('account is inactive ');
			//reset();
		}	
	//	else if(msg[0]=="AllAttempt"){
		else if(str=="AllAttempt"){
			//Alert.show(commonFunction.getMessages('allAttemptFinish'),commonFunction.getMessages('info'),null,null,null,errorIcon);
			// Alert.show(commonFunction.getMessages('allAttemptFinish'),commonFunction.getMessages('info'),null,null,null,errorIcon);
			// reset();
		}	
		//else if(msg[0]=="LastAttempt"){
		else if(str=="LastAttempt"){
			// Alert.show(commonFunction.getMessages('lastAttempt'),commonFunction.getMessages('info'),null,null,null,errorIcon);
			// reset();
		}	 
//		else if(msg[0]=="InvalidLogin"){
		else if(str=="InvalidLogin"){
			// Alert.show(commonFunction.getMessages('invalidLoginDetails'),commonFunction.getMessages('info'),null,null,null,errorIcon);
			// reset();
			this.userservice.log('account is Invalid');
		}	
	}
	else{
		//Alert.show(commonFunction.getMessages('invalidPassword'),commonFunction.getMessages('error'),0,null,null,errorIcon);
		this.userservice.log('invalidPassword');
	}
}
 LoginRoleServiceFault(res){
	//Alert.show("Failed to get roles");
}
 getLoginDetails(res){
//	Alert.show(rolesXML.loginInfo.(userGroupName==selectRolectPopup.roleCombo.selectedLabel).userGroupId.toString());
	// params["userName"]=userName;
	// params["password"]=password;
  // params["application"]=application;
  console.log(res);
	if(this.roles.size() == 1){
		// params["userGroupId"]=rolesXML.loginInfo.userGroupId;
		// params["maxLogins"]=rolesXML.loginInfo.maxLogins;
    console.log(res.loginInfo.loginInfo[0].userGroupId);
		this.params=this.params.append("userGroupId",res.loginInfo.loginInfo[0].userGroupId);
    this.params=this.params.append("maxLogins",res.loginInfo.loginInfo[0].maxLogins );
    
    console.log(this.params);


	}else{
		// params["userGroupId"]=rolesXML.loginInfo.(userGroupName==selectRolectPopup.roleCombo.selectedLabel).userGroupId;
		// params["maxLogins"]=rolesXML.loginInfo.(userGroupName==selectRolectPopup.roleCombo.selectedLabel).maxLogins;

		console.log("More than one role");

	}
	//params["date"]=new Date;
	this.params.append("date",new Date().toString());
	this.getLoginInfoService(this.params);
}


getLoginInfoService(params)
{
	let  myparam ={
		method:'/login/getLoginDetails.htm',
		xmltojs:'Y'
		};
console.log("inside login info");
let  data= null;
console.log(params);
this.userservice.getdata(params,myparam).subscribe(res=>{
  console.log(res);
data = JSON.parse(res);
console.log(data.loginInfo.loginInfo);
if (isUndefined((data.loginInfo.loginInfo))){
  this.userservice.log("Invalid login");
  return;
}else{
  this.loginInfoResultHandler(data)
};

});
	

}

//login result handler
 loginInfoResultHandler(res)
{
  //userInfoXml=event.result as XML;	
  console.log("inside loginInfoResultHandler" );
  console.log(res);
  let valuesset=new Collections.Set<User>() ;
  //let values=new Collections.Set<User>() ;
  //let values:  Array <User>;
  
	for (var obj of res.loginInfo.loginInfo)
	{
		valuesset.add({userId:obj.userId,universityId:obj.universityId,userGroupId:obj.userGroupId,
		userGroupName:obj.userGroupName,userName:obj.userName, universityName:obj.universityName,status:obj.status});
	}
  
  console.log(valuesset.toArray());
  let values=valuesset.toArray();
  console.log(values[0].status);
  //let myobj:User={};
   
	if(values.length>0){
    
	 this.expiryStatus=String(values[0].status);
		 this.userId=String(values[0].userId);
		 this.userName=String(values[0].userName);
		 this.universityId=String(values[0].universityId);
		 this.universityName=String(values[0].universityName);
		 this.startDate=String(values[0].startDate);
		 this.endDate=String(values[0].endDate);
		// userNameText.text="";
		// passwordText.text="";	
		// userNameLabel.visible=true;						
		this.userGroupId=String(values[0].userGroupId);
		this.userGroupName=String(values[0].userGroupName);
		
		this.getMenues(this.userGroupId,this.userGroupName);	
		//added by Jyoti on 22-Dec-2017
		if (this.userGroupId == 'STD')
		{
			//settingsLink.visible = false;
		}					
		else
		{
			//settingsLink.visible = true;
		}	//added till here	
		if (this.roleSelectionAllowed)
		{
			//changeRoleLink.visible = true;
		}							 	
	}
	else if(res.exception.exceptionstring == "NotAllowed"){
		//loginDetailsCanvas.visible=true;
		//Alert.show('You Are Already Logged In',commonFunction.getMessages('error'),0,null,null,errorIcon);
		this.userservice.log('You Are Already Logged In');
	}else{
		//loginDetailsCanvas.visible=true;
		//userInfoXml=new XML;   //added by Jyoti on 31 Jul 2020
		//vStack.selectedIndex=0;	//added by Jyoti on 31 Jul 2020
		//userNameLabel.visible=false;	//added by Jyoti on 31 Jul 2020
		//loaderCanvas.removeAllChildren();	//added by Jyoti on 31 Jul 2020
		//userNameText.setFocus();	//added by Jyoti on 31 Jul 2020
		//Alert.show(commonFunction.getMessages('invalidPassword'),commonFunction.getMessages('error'),0,null,null,errorIcon);
	}
}

//getting menues
 getMenues(roleId:String,roleName:String):void
{
	var param:Object=new Object();
	param["userGroupId"]=roleId;
	param["userGroupName"]=roleName;
	param["application"]="CMS";
	//menuHttpService.send(param);

	console.log("in get menues");
        
  this.router.navigate(['\dashboard']);
}

//login fault handler
 loginInfoFaultHandler(res):void
{
	//Alert.show(event.message+"");

	this.userservice.log(res.message);
}

//logout result handler
 logoutResultHandler(res):void
{
	this.logout();
}

//logout result handler
 logoutFaultHandler(res):void
{
	this.logout();
}

//On click of logout button
logout():void
{
	//Alert.show(commonFunction.getMessages('successOnLogout'),commonFunction.getMessages('success'),0,null,null,successIcon);

	this.userservice.log("successOnLogout");
	// userInfoXml=new XML;
	// vStack.selectedIndex=0;
	// userNameLabel.visible=false;
	// loaderCanvas.removeAllChildren();
	// userNameText.setFocus();
}

//on click of setting button
 goToSettings():void
{
	// loaderCanvas.removeAllChildren();
	// loaderCanvas.addChild(new SettingPanel);
}
/**
 *On enter key Event at Login Button 
 * added by ashish mohan
 */
 onLogin(event:KeyboardEvent):void{
	// if(event.keyCode==13){
	// Login();	
	// }
}
 reset():void{
	// userNameText.text="";
	// passwordText.text="";	
}

   

}

