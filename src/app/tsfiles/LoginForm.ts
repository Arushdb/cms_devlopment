/**
 * @(#) LoginForm.as
 * Copyright (c) 2011 EdRP, Dayalbagh Educational Institute.
 * All Rights Reserved.
 *
 * Redistribution and use in source and binary forms, with or
 * without modification, are permitted provided that the following
 * conditions are met:
 *
 * Redistributions of source code must retain the above copyright
 * notice, this  list of conditions and the following disclaimer.
 *
 * Redistribution in binary form must reproducuce the above copyright
 * notice, this list of conditions and the following disclaimer in
 * the documentation and/or other materials provided with the
 * distribution.
 *
 *
 * THIS SOFTWARE IS PROVIDED ``AS IS'' AND ANY EXPRESSED OR IMPLIED
 * WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
 * OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED.  IN NO EVENT SHALL ETRG OR ITS CONTRIBUTORS BE LIABLE
 * FOR ANY DIRECT, INDIRECT, INCIDENTAL,SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT
 * OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR
 * BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY,
 * WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE
 * OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
 * EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 * Contributors: Members of EdRP, Dayalbagh Educational Institute
 */
import RoleSelector = common.RoleSelector;
import SettingPanel = common.SettingPanel;
import commonFunction = common.commonFunction;

import * = flash.external.*;

import ArrayCollection = mx.collections.ArrayCollection;
import Alert = mx.controls.Alert;
import FlexEvent = mx.events.FlexEvent;
import PopUpManager = mx.managers.PopUpManager;
import FaultEvent = mx.rpc.events.FaultEvent;
import ResultEvent = mx.rpc.events.ResultEvent;
import Validator = mx.validators.Validator;


[Embed(source="/images/error.png")]private var errorIcon:Class;
[Embed(source="/images/success.png")]private var successIcon:Class;
[Embed(source="/images/reset.png")]private var resetIcon:Class;
[Embed(source="/images/question.png")]private var questionIcon:Class;

public var params:Object={};
[Bindable] public var universityId:String;
[Bindable] public var userId:String;
[Bindable] public var userGroupId:String;
[Bindable] public var userGroupName:String;
[Bindable]public var urlPrefix:String;
[Bindable] public var userName:String;
[Bindable] public var password:String;
[Bindable] public var application:String;
[Bindable] public var universityName:String;
[Bindable] public var startDate:String;
[Bindable] public var endDate:String;
[Bindable] public var expiryStatus:String;
[Bindable] public var func:Function;
var selectRolectPopup:RoleSelector = new RoleSelector();
var rolesXML:XML = new XML;
var roles:ArrayCollection=new ArrayCollection();
var roleSelectionAllowed:Boolean = false;  //added by Jyoti on 31 Jul 2020
var userInfoXml:XML;

//Initilize Login Form
public function onCreationComplete(event:FlexEvent):void
{
	ExternalInterface.addCallback("unloadMethod", unloadMethod);
	urlPrefix=commonFunction.getConstants('url')+"/login/";
	userNameText.setFocus();
}

public function unloadMethod():String{
//	Alert.show("Inside New Logout");

	setLogoutService.send([new Date]);
	return "Logout";
}

//On click of login button
public function Login():void
{
	if(Validator.validateAll([userNameValidator,passwordValidator,emailvalidator]).length==0)
	{
		userPasswordLabel.visible=false;
		userName = userNameText.text;
		password = passwordText.text;
		application = "CMS";
		params["userName"]=userNameText.text;
		params["password"]=passwordText.text;
		params["application"]=application;
		params["date"]=new Date;
		if(currentState=="RequestPassword"){
			requestPasswordService.send(params);
		}else{
			loginRoleService.send(params);
				}
		
	}
	else{
		userPasswordLabel.visible=true;
	}
}

public function requestPasswordServiceResult(event:ResultEvent):void{
	
	
	Alert.show(event.result.response.toString());
}

public function requestPasswordServiceFault(event:FaultEvent):void{
	Alert.show(event.fault.toString());
	
}
public function onRoleChange():void   //added by Jyoti on 31 Jul 2020
{
		loaderCanvas.removeAllChildren();
 		selectRolectPopup=RoleSelector(PopUpManager.createPopUp(this,RoleSelector,true));
				selectRolectPopup.roleCombo.dataProvider=rolesXML.loginInfo.userGroupName;
				selectRolectPopup.roleCombo.selectedIndex=-1;
				selectRolectPopup.dataXml=rolesXML;
				selectRolectPopup.refFunction=getLoginDetails;
				PopUpManager.centerPopUp(selectRolectPopup);
}
public function LoginRoleServiceResult(event:ResultEvent):void{
	rolesXML = event.result as XML;
	roles.removeAll();
	for each(var obj:Object in rolesXML.loginInfo){
		roles.addItem({userGroupId:obj.userGroupId,lastLogin:obj.lastLogin,maxLogins:obj.maxLogins,status:obj.status});
	}
	if(roles.length>0){
		var str:String=roles[0].status;
		var msg:Array=str.split("-");		
		if(msg[0]=="ACT"){
			if(roles.length > 1){
				roleSelectionAllowed = true;		//added by Jyoti on 31 Jul 2020
				loginDetailsCanvas.visible=false;
				selectRolectPopup=RoleSelector(PopUpManager.createPopUp(this,RoleSelector,true));
				selectRolectPopup.roleCombo.dataProvider=rolesXML.loginInfo.userGroupName;
				selectRolectPopup.roleCombo.selectedIndex=-1;
				selectRolectPopup.dataXml=rolesXML;
				selectRolectPopup.refFunction=getLoginDetails;
				PopUpManager.centerPopUp(selectRolectPopup);
			}else if(roles.length == 1){
				roleSelectionAllowed = false;  //added by Jyoti on 31 Jul 2020
				getLoginDetails();
			}
		}
		else if(msg[0]=="DIS"){
			Alert.show(commonFunction.getMessages('accountDissable'),commonFunction.getMessages('info'),null,null,null,infoIcon);
			reset();
		}
		else if(msg[0]=="INA"){
			Alert.show(commonFunction.getMessages('accountInactive'),commonFunction.getMessages('info'),null,null,null,infoIcon);
			reset();
		}	
		else if(msg[0]=="AllAttempt"){
			Alert.show(commonFunction.getMessages('allAttemptFinish'),commonFunction.getMessages('info'),null,null,null,errorIcon);
			reset();
		}	
		else if(msg[0]=="LastAttempt"){
			Alert.show(commonFunction.getMessages('lastAttempt'),commonFunction.getMessages('info'),null,null,null,errorIcon);
			reset();
		}	 
		else if(msg[0]=="InvalidLogin"){
			Alert.show(commonFunction.getMessages('invalidLoginDetails'),commonFunction.getMessages('info'),null,null,null,errorIcon);
			reset();
		}	
	}
	else{
		Alert.show(commonFunction.getMessages('invalidPassword'),commonFunction.getMessages('error'),0,null,null,errorIcon);
	}
}
public function LoginRoleServiceFault(event:FaultEvent):void{
	Alert.show("Failed to get roles");
}
public function getLoginDetails():void{
//	Alert.show(rolesXML.loginInfo.(userGroupName==selectRolectPopup.roleCombo.selectedLabel).userGroupId.toString());
	params["userName"]=userName;
	params["password"]=password;
	params["application"]=application;
	if(roles.length == 1){
		params["userGroupId"]=rolesXML.loginInfo.userGroupId;
		params["maxLogins"]=rolesXML.loginInfo.maxLogins;
	}else{
		params["userGroupId"]=rolesXML.loginInfo.(userGroupName==selectRolectPopup.roleCombo.selectedLabel).userGroupId;
		params["maxLogins"]=rolesXML.loginInfo.(userGroupName==selectRolectPopup.roleCombo.selectedLabel).maxLogins;
	}
	params["date"]=new Date;
	getLoginInfoService.send(params);
}

//login result handler
public function loginInfoResultHandler(event:ResultEvent):void
{
	userInfoXml=event.result as XML;	
	var values:ArrayCollection=new ArrayCollection();
	for each(var obj:Object in userInfoXml.loginInfo)
	{
		values.addItem({userId:obj.userId,universityId:obj.universityId,userGroupId:obj.userGroupId,
		userGroupName:obj.userGroupName,userName:obj.userName, universityName:obj.universityName,status:obj.status});
	}
	
	if(values.length>0){
		expiryStatus=values[0].status;
		userId=values[0].userId;
		userName=values[0].userName;
		universityId=values[0].universityId;
		universityName=values[0].universityName;
		startDate=values[0].startDate;
		endDate=values[0].endDate;
		userNameText.text="";
		passwordText.text="";	
		userNameLabel.visible=true;						
		userGroupId=values[0].userGroupId;
		userGroupName=values[0].userGroupName;
		getMenues(userGroupId,userGroupName);	
		//added by Jyoti on 22-Dec-2017
		if (userGroupId == 'STD')
		{
			settingsLink.visible = false;
		}					
		else
		{
			settingsLink.visible = true;
		}	//added till here	
		if (roleSelectionAllowed)
		{
			changeRoleLink.visible = true;
		}							 	
	}
	else if(userInfoXml.exception.exceptionstring == "NotAllowed"){
		loginDetailsCanvas.visible=true;
		Alert.show('You Are Already Logged In',commonFunction.getMessages('error'),0,null,null,errorIcon);
	}else{
		loginDetailsCanvas.visible=true;
		userInfoXml=new XML;   //added by Jyoti on 31 Jul 2020
		vStack.selectedIndex=0;	//added by Jyoti on 31 Jul 2020
		userNameLabel.visible=false;	//added by Jyoti on 31 Jul 2020
		loaderCanvas.removeAllChildren();	//added by Jyoti on 31 Jul 2020
		userNameText.setFocus();	//added by Jyoti on 31 Jul 2020
		Alert.show(commonFunction.getMessages('invalidPassword'),commonFunction.getMessages('error'),0,null,null,errorIcon);
	}
}

//getting menues
public function getMenues(roleId:String,roleName:String):void
{
	var param:Object=new Object();
	param["userGroupId"]=roleId;
	param["userGroupName"]=roleName;
	param["application"]="CMS";
	menuHttpService.send(param);
}

//login fault handler
public function loginInfoFaultHandler(event:FaultEvent):void
{
	Alert.show(event.message+"");
}

//logout result handler
public function logoutResultHandler(event:ResultEvent):void
{
	logout();
}

//logout result handler
public function logoutFaultHandler(event:FaultEvent):void
{
	logout();
}

//On click of logout button
public function logout():void
{
	Alert.show(commonFunction.getMessages('successOnLogout'),commonFunction.getMessages('success'),0,null,null,successIcon);
	userInfoXml=new XML;
	vStack.selectedIndex=0;
	userNameLabel.visible=false;
	loaderCanvas.removeAllChildren();
	userNameText.setFocus();
}

//on click of setting button
public function goToSettings():void
{
	loaderCanvas.removeAllChildren();
	loaderCanvas.addChild(new SettingPanel);
}
/**
 *On enter key Event at Login Button 
 * added by ashish mohan
 */
public function onLogin(event:KeyboardEvent):void{
	if(event.keyCode==13){
	Login();	
	}
}
public function reset():void{
	userNameText.text="";
	passwordText.text="";	
