/**
 * @(#) AwardBlankAction.as
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

	import AdvancedGridOperations = awardBlankSheet.AdvancedGridOperations;
	import ApprovedRequest = awardBlankSheet.ApprovedRequest;
	
	import Mask = common.Mask;
	import commonFunction = common.commonFunction;
	
	import MouseEvent = flash.events.MouseEvent;
	import TimerEvent = flash.events.TimerEvent;
	import URLRequest = flash.net.URLRequest;
	import navigateToURL = flash.net.navigateToURL;
	import Timer = flash.utils.Timer;
	import getTimer = flash.utils.getTimer;
	
	import ArrayCollection = mx.collections.ArrayCollection;
	import AdvancedDataGrid = mx.controls.AdvancedDataGrid;
	import Alert = mx.controls.Alert;
	import LinkButton = mx.controls.LinkButton;
	import AdvancedDataGridColumn = mx.controls.advancedDataGridClasses.AdvancedDataGridColumn;
	import CloseEvent = mx.events.CloseEvent;
	import PopUpManager = mx.managers.PopUpManager;
	import ResultEvent = mx.rpc.events.ResultEvent;
	import Validator = mx.validators.Validator;
	
	/*[Bindable]*/ private var statusXml:XML;
	/*[Bindable]*/ private var pendingXml:XML;
	/*[Bindable]*/	var gridData:ArrayCollection ;
	public var entityId:String=null;
	public var programId:String=null;
	public var entityType:String=null;
	public var branchId:String=null;
	public var specializationId:String=null;
	public var semesterId:String=null;
	public var courseCode:String=null;
	public var courseName:String=null;
	public var sessionStartDate:String=null;
	public var sessionEndDate:String=null;
	public var resultSystem:String=null;
	public var entityName:String=null;
	public var programName:String=null;
	public var branchName:String=null;
	public var specializationName:String=null;
	public var semesterName:String=null;
	public var entityTypeName:String=null;
	public var pendingList:PendingRequest;
	public var approvedList:ApprovedRequest;
	public var rejectedList:RejectedRequest;
	public var msg:String;
public var importDHAClicked:String="No";
	/*[Embed(source="/images/success.png")]*/private var successIcon:Class;	
	/*[Embed(source="/images/error.png")]*/private var errorIcon:Class;
	/*[Embed(source="/images/warning.png")]*/private var warningIcon:Class;
	/*[Embed(source="/images/question.png")]*/private var questionIcon:Class;
	/*[Embed(source="/images/infoIcon.png")]*/private var infoIcon:Class;
	
	public var semesterStartDate:String;
	public var semesterEndDate:String;
	public var prevousEmployeeId:String;
	public var employeeName:String;
	//public var gradelimit:String;  // Arush 
	/*[Bindable]*/public var pendingAC:ArrayCollection;
	/*[Bindable]*/public var approvedAC:ArrayCollection;
	/*[Bindable]*/export function setButtonPressed(status:string):void{
		buttonPressed=status;
	}
	
	/**
	 * function for setting values for variables based on selections
	 */
	export function setVariables():void{
		if(buttonPressed=='SW'){ // show button
			Mask.show(commonFunction.getMessages('pleaseWait'));
			getEvaluationComponents();			
		}
		else if(buttonPressed=='PL'){// pending list
			var selectedPendingListArrCol:ArrayCollection=AdvancedGridOperations.getSelectedRowData(pendingList.pendingListGrid);
			if(selectedPendingListArrCol.length>0){
				entityId=selectedPendingListArrCol.getItemAt(0).entityId;
				entityType=selectedPendingListArrCol.getItemAt(0).entityType;
				programId=selectedPendingListArrCol.getItemAt(0).programId;
				branchId=selectedPendingListArrCol.getItemAt(0).branchId;
				specializationId=selectedPendingListArrCol.getItemAt(0).specializationId;
				semesterId=selectedPendingListArrCol.getItemAt(0).semesterCode;
				courseCode=selectedPendingListArrCol.getItemAt(0).courseCode;
				semesterStartDate=selectedPendingListArrCol.getItemAt(0).startDate;
				semesterEndDate=selectedPendingListArrCol.getItemAt(0).endDate;
				entityName=selectedPendingListArrCol.getItemAt(0).entityName;
				entityTypeName=selectedPendingListArrCol.getItemAt(0).entityTypeName;
				programName=selectedPendingListArrCol.getItemAt(0).programName;
				branchName=selectedPendingListArrCol.getItemAt(0).branchName;
				specializationName=selectedPendingListArrCol.getItemAt(0).specializationName;
				semesterName=selectedPendingListArrCol.getItemAt(0).semesterName;
				courseName=selectedPendingListArrCol.getItemAt(0).courseName;
				resultSystem=selectedPendingListArrCol.getItemAt(0).resultSystem;
				programCourseKey=selectedPendingListArrCol.getItemAt(0).programCourseKey;
				displayType = selectedPendingListArrCol.getItemAt(0).displayType;
				prevousEmployeeId = selectedPendingListArrCol.getItemAt(0).employeeId;
				showFile();
			}else{
				Alert.show(commonFunction.getMessages('pleaseSelectAtleastOneRecord'),commonFunction.getMessages('info'),4,null,null,errorIcon);
			}
		}
		else if(buttonPressed=='AP'){ // approved list
			var selectedApprovedListArrCol:ArrayCollection=AdvancedGridOperations.getSelectedRowData(approvedList.approvedListGrid);
			if(selectedApprovedListArrCol.length>0){
				entityId=selectedApprovedListArrCol.getItemAt(0).entityId;
				entityType=selectedApprovedListArrCol.getItemAt(0).entityType;
				programId=selectedApprovedListArrCol.getItemAt(0).programId;
				branchId=selectedApprovedListArrCol.getItemAt(0).branchId;
				specializationId=selectedApprovedListArrCol.getItemAt(0).specializationId;
				semesterId=selectedApprovedListArrCol.getItemAt(0).semesterCode;
				courseCode=selectedApprovedListArrCol.getItemAt(0).courseCode;
				semesterStartDate=selectedApprovedListArrCol.getItemAt(0).startDate;
				semesterEndDate=selectedApprovedListArrCol.getItemAt(0).endDate;
				entityName=selectedApprovedListArrCol.getItemAt(0).entityName;
				entityTypeName=selectedApprovedListArrCol.getItemAt(0).entityTypeName;
				programName=selectedApprovedListArrCol.getItemAt(0).programName;
				branchName=selectedApprovedListArrCol.getItemAt(0).branchName;
				specializationName=selectedApprovedListArrCol.getItemAt(0).specializationName;
				semesterName=selectedApprovedListArrCol.getItemAt(0).semesterName;
				courseName=selectedApprovedListArrCol.getItemAt(0).courseName;
				resultSystem=selectedApprovedListArrCol.getItemAt(0).resultSystem;
				programCourseKey=selectedApprovedListArrCol.getItemAt(0).programCourseKey;
				displayType = selectedApprovedListArrCol.getItemAt(0).displayType;
				prevousEmployeeId = selectedApprovedListArrCol.getItemAt(0).employeeId;
			    showFile();
			}else{
				Alert.show(commonFunction.getMessages('pleaseSelectAtleastOneRecord'),commonFunction.getMessages('info'),4,null,null,errorIcon);
			}
		}
		else if(buttonPressed=='RJ'){ // reject list
			var selectedRejectListArrCol:ArrayCollection=AdvancedGridOperations.getSelectedRowData(rejectedList.rejectedListGrid);
			if(selectedRejectListArrCol.length>0){
				entityId=selectedRejectListArrCol.getItemAt(0).entityId;
				entityType=selectedRejectListArrCol.getItemAt(0).entityType;
				programId=selectedRejectListArrCol.getItemAt(0).programId;
				branchId=selectedRejectListArrCol.getItemAt(0).branchId;
				specializationId=selectedRejectListArrCol.getItemAt(0).specializationId;
				semesterId=selectedRejectListArrCol.getItemAt(0).semesterCode;
				courseCode=selectedRejectListArrCol.getItemAt(0).courseCode;
				semesterStartDate=selectedRejectListArrCol.getItemAt(0).startDate;
				semesterEndDate=selectedRejectListArrCol.getItemAt(0).endDate;
				entityName=selectedRejectListArrCol.getItemAt(0).entityName;
				entityTypeName=selectedRejectListArrCol.getItemAt(0).entityTypeName;
				programName=selectedRejectListArrCol.getItemAt(0).programName;
				branchName=selectedRejectListArrCol.getItemAt(0).branchName;
				specializationName=selectedRejectListArrCol.getItemAt(0).specializationName;
				semesterName=selectedRejectListArrCol.getItemAt(0).semesterName;
				courseName=selectedRejectListArrCol.getItemAt(0).courseName;
				resultSystem=selectedRejectListArrCol.getItemAt(0).resultSystem;
				programCourseKey=selectedRejectListArrCol.getItemAt(0).programCourseKey;
				displayType = selectedRejectListArrCol.getItemAt(0).displayType;
				prevousEmployeeId = selectedRejectListArrCol.getItemAt(0).employeeId;						    
			    showFile();		
			}else{
				Alert.show(commonFunction.getMessages('pleaseSelectAtleastOneRecord'),commonFunction.getMessages('info'),4,null,null,errorIcon);
			}
		}
	}
	
	 function showFile():void{
		var params:Object =new Object();
		params["entityName"]=entityName;
		params["entityId"]=entityId;
		params["courseCode"]=courseCode;
	 	params["courseName"]=courseName;	 	
	 	params["startDate"]=semesterStartDate;
		params["endDate"]=semesterEndDate;
		params["employeeCode"]=employeeCode; 
		params["previousStatus"]='SUB';
		params["displayType"]=displayType;
		params["programName"]=programName;
		params["branchName"]=branchName;
		params["specializationName"]=specializationName;
		params["semesterName"]=semesterName;
		params["previousEmployeeId"]=prevousEmployeeId;
		params["programCourseKey"]=programCourseKey;
		Mask.show(commonFunction.getMessages('pleaseWait'));
		httpShowApprovedRequests.send(params); // http request will open the PDF file of selected request
	}
	
	 function showFileResultHandler(event:ResultEvent):void{
		var resultXML:XML=<XML>event.result ;
		
		if(resultXML.sessionConfirm == true){
    		Alert.show(commonFunction.getMessages('sessionInactive'),commonFunction.getMessages('error'), 4, null,null,errorIcon);
    		this.parentDocument.vStack.selectedIndex=0;
			this.parentDocument.loaderCanvas.removeAllChildren();
		}
		
		Mask.close();
		var fileName:string=resultXML.exception.exceptionstring;
			navigateToURL(new URLRequest(commonFunction.getConstants('url')+"/"+fileName));		
	}
	

	/**
	 * function for enabling/disabling buttons according to status
	 */
	 function resultHandlerStatus(event:ResultEvent):void{
		statusXml=<XML>event.result ;
		
		if(statusXml.sessionConfirm == true){
    		Alert.show(commonFunction.getMessages('sessionInactive'),commonFunction.getMessages('error'), 4, null,null,errorIcon);
    		this.parentDocument.vStack.selectedIndex=0;
			this.parentDocument.loaderCanvas.removeAllChildren();
		}
		
	   	var status:string=statusXml.exception.exceptionstring;
		switch(status+""){
			case 'WDW': submitForApprovalButton.enabled=true;
		  				saveButton.enabled=true;	
		  				gradelimitButton.enabled=true ;
		  				mkcorrectionButton.enabled=true ;
		  				withdrawButton.enabled=false;
		  				break;
		  	case 'SUB': //withdrawButton.enabled=true;  //Arush on 12/05/15
		  	            withdrawButton.enabled=false;  //Arush on 12/05/15
		  				submitForApprovalButton.enabled=false;
		  				saveButton.enabled=false;
		  				gradelimitButton.enabled=false ;
		  				mkcorrectionButton.enabled=false ;
						importDHA.enabled=false; //Manpreet on 29-10-2016
		  				break;	
		  	case 'APR': withdrawButton.enabled=false;
		  				submitForApprovalButton.enabled=false;
		  				mkcorrectionButton.enabled=false ;
		  				saveButton.enabled=false;
		  				gradelimitButton.enabled=false ;
						importDHA.enabled=false; //Manpreet on 29-10-2016
		  				break;	  				
		  	default:   submitForApprovalButton.enabled=true;
		  				saveButton.enabled=true;
		  				withdrawButton.enabled=false;
		  				gradelimitButton.enabled=true ;
		  				mkcorrectionButton.enabled=true ;
		  				break;
		  }
		  Mask.close();
		  if(importDHAClicked=="Yes"){
			  importDHAClicked="No"; 
//			  		Alert.show("fir se save chala");
		  saveMarks("auto");
		  }
	}
 
 	
	 /**
	 * function for getting list of pending requests
	 */
	  function resultHandlerPendingList(event:ResultEvent):void{
	 	pendingXml=<XML>event.result ;
	 	
	 	if(pendingXml.sessionConfirm == true){
    		Alert.show(commonFunction.getMessages('sessionInactive'),commonFunction.getMessages('error'), 4, null,null,errorIcon);
    		this.parentDocument.vStack.selectedIndex=0;
			this.parentDocument.loaderCanvas.removeAllChildren();
		}
	 	
	 	pendingAC=new ArrayCollection();
		var flag:boolean=true;
		var displayTypeDescription:string;
	   	for each (var object:Object in pendingXml.root){
	   		if(object.displayType=="I"){
	   			displayTypeDescription="Internal";
	   		}
	   		else if(object.displayType=="E"){
	   			displayTypeDescription="External";
	   		}
	   		else if(object.displayType=="R"){
	   			displayTypeDescription="Remedial";
	   		}
	   		
	   		pendingAC.addItem({select:false,courseName:object.courseName,courseCode:object.courseCode,
	   		entityId:object.entityId,entityType:object.entityType,programId:object.programId,
	   		branchId:object.branchId,specializationId:object.specializationId,semesterCode:object.semesterCode,
	   		startDate:object.startDate,endDate:object.endDate, entityName:object.entityName, entityTypeName:object.entityTypeName,
	   		programName:object.programName, branchName:object.branchName, specializationName:object.specializationName, 
	   		semesterName:object.semesterName,resultSystem:object.resultSystem, programCourseKey:object.programCourseKey, 
	   		displayType:object.displayType, displayTypeDescription:displayTypeDescription, 
	   		employeeId:object.employeeId, employeeName:object.employeeName});
	   	}
	   	
	   	if(pendingAC.length>0)
	   	{
	   		var showPendingButton:LinkButton = new LinkButton();
	   		showPendingButton.label=commonFunction.getConstants('pendingAwardBlank'); 
	   		showPendingButton.addEventListener(MouseEvent.CLICK,showPendingList);
	   		vbox.addChild(showPendingButton);
	   		courselistCanvas.y=vbox.height+60;
	   	}
	 } 
	 
	 
	 /**
	 * function for getting list of pending requests
	 */
	  function resultHandlerApprovedList(event:ResultEvent):void{
	 	pendingXml=<XML>event.result ;
	 	
	 	if(pendingXml.sessionConfirm == true){
    		Alert.show(commonFunction.getMessages('sessionInactive'),commonFunction.getMessages('error'), 4, null,null,errorIcon);
    		this.parentDocument.vStack.selectedIndex=0;
			this.parentDocument.loaderCanvas.removeAllChildren();
		}
	 	
	 	approvedAC=new ArrayCollection();
	   	var flag:boolean=true;
	   	var displayTypeDescription:string;
	   	
	   	for each (var object:Object in pendingXml.root){
	   		if(object.displayType=="I"){
	   			displayTypeDescription="Internal";
	   		}
	   		else if(object.displayType=="E"){
	   			displayTypeDescription="External";
	   		}
	   		else if(object.displayType=="R"){
	   			displayTypeDescription="Remedial";
	   		}
	   		
	   		approvedAC.addItem({select:false,courseName:object.courseName,courseCode:object.courseCode,
	   		entityId:object.entityId,entityType:object.entityType,programId:object.programId,
	   		branchId:object.branchId,specializationId:object.specializationId,semesterCode:object.semesterCode,
	   		startDate:object.startDate,endDate:object.endDate, entityName:object.entityName, entityTypeName:object.entityTypeName,
	   		programName:object.programName, branchName:object.branchName, specializationName:object.specializationName, 
	   		semesterName:object.semesterName,resultSystem:object.resultSystem, programCourseKey:object.programCourseKey,
	   		displayType:object.displayType,	displayTypeDescription:displayTypeDescription, 
	   		employeeId:object.employeeId, employeeName:object.employeeName});
	   	}
	   	
	   	if(approvedAC.length>0)
	   	{
	   		var showApprovedButton:LinkButton = new LinkButton();
	   		showApprovedButton.label=commonFunction.getConstants('approvedAwardBlank'); 
	   		showApprovedButton.addEventListener(MouseEvent.CLICK,showApprovedList);
	   		vbox.addChild(showApprovedButton);
	   		courselistCanvas.y=vbox.height+60;
	   	}
	 }
	 
	 /**
	 * function for getting list of pending requests
	 */
	  function resultHandler_RejectedList(event:ResultEvent):void{
	 	pendingXml=null;
	 	pendingXml=<XML>event.result ;
	 	
	 	if(pendingXml.sessionConfirm == true){
    		Alert.show(commonFunction.getMessages('sessionInactive'),commonFunction.getMessages('error'), 4, null,null,errorIcon);
    		this.parentDocument.vStack.selectedIndex=0;
			this.parentDocument.loaderCanvas.removeAllChildren();
		}
	 		 	
	   	rejectedAC=new ArrayCollection();
		var flag:boolean=true;
		var displayTypeDescription:string;
	   	
	   	for each (var object:Object in pendingXml.root){
	   		if(object.displayType=="I"){
	   			displayTypeDescription="Internal";
	   		}
	   		else if(object.displayType=="E"){
	   			displayTypeDescription="External";
	   		}
	   		else if(object.displayType=="R"){
	   			displayTypeDescription="Remedial";
	   		}	   	
	   	
	   		rejectedAC.addItem({select:false,courseName:object.courseName,courseCode:object.courseCode,
	   		entityId:object.entityId,entityType:object.entityType,programId:object.programId,
	   		branchId:object.branchId,specializationId:object.specializationId,semesterCode:object.semesterCode,
	   		startDate:object.startDate,endDate:object.endDate, entityName:object.entityName, entityTypeName:object.entityTypeName,
	   		programName:object.programName, branchName:object.branchName, specializationName:object.specializationName, 
	   		semesterName:object.semesterName,resultSystem:object.resultSystem,reason:object.reason,
	   		displayType:object.displayType,	displayTypeDescription:displayTypeDescription,
	   		employeeId:object.employeeId, employeeName:object.employeeName,programCourseKey:object.programCourseKey});
	   	}
	   	
	   	if(rejectedAC.length>0)
	   	{
	   		var showRejectedButton:LinkButton = new LinkButton();
	   		showRejectedButton.label=commonFunction.getConstants('rejectedAwardBlank'); 
	   		showRejectedButton.addEventListener(MouseEvent.CLICK,showRejectedList);
	   		vbox.addChild(showRejectedButton);	  
	   		courselistCanvas.y=vbox.height+60;
	   	}
	 }  
 
 
     function checkGradeField():boolean{
    	var bool:boolean=true;
    	for each(var obj:Object in <ArrayCollection>awardSheetGrid.dataProvider ){
    		if(obj.grade=="" || obj.grade==null){
    			bool=false;
    		}
    	}
    	return bool;
    }  
    
    //  Arush Validation ; Check Grades enetered thru excel. 
      function validategrade(){
      for each(var obj:Object in <ArrayCollection>awardSheetGrid.dataProvider ){
     if (obj.grade!= "" || obj.grade!=null){
     	
     		
     	
     	Alert.show("check grade value "+gradeXML.grade);
   
     	
     	
     }
     }
     }
 	
 	 function submitConfirm():void{
		Alert.show(commonFunction.getMessages('areyousure'),commonFunction.getMessages('confirm'),3,null,submitSheet,questionIcon); 	
	}
 	
	 /**
	 * function for submitting award sheet for approval
	 */
	 function submitSheet(event:CloseEvent):void{
		
		var totmrk :number;
		awardSheetGrid.dataProvider.refresh();// Arush 18-2-2014
		if(event.detail==Alert.YES){
			gridData = new ArrayCollection;
			if (requestpending()){
			Alert.show("Request for marks correction is pending from Roll Number: "+msg,commonFunction.getMessages('info'),4,null,null,infoIcon)
			return;
			}
			
		//var gridData:ArrayCollection=commonFunction.getAdvancedDataGridRowData(awardSheetGrid);
		gridData = commonFunction.getAdvancedDataGridRowData(awardSheetGrid);
			if(gridData.length>0){
				var s:string="";
				var col:AdvancedDataGridColumn;// Arush 18-2-2014
				for each(var o:Object in gridData){
					getTotal(o,col );		// make sure label function is called for each record  Arush 18-2-2014
					
						if (gradelimit=='1'){
					if(displayType.toUpperCase()=="I"){
		    						totmrk=o["totalInternal"];
		    						}
		    						else if(displayType.toUpperCase()=="E"){
		    							totmrk=o["totalExternal"];
		    						} else{
		    							totmrk=o["totalMarks"];
		    						}
		    						
		    						var wgrade:string = calculategrade(totmrk);
		    						if (wgrade==null){
		    						Alert.show("Grade does not exists in grade limit for marks = "+ totmrk,commonFunction.getMessages('info'),4,null,null,infoIcon);	
		    						return;
		    						}
				 }else{
				 	wgrade = o["grade"] ;
				 }
					
					for(var v:string in o){

			    			if((v!="rollNumber")&&(v!="studentName")&&(v!="totalMarks")&&(v!=o[v]+"idType")&&
			    	//		(v!="externalGrade")&&(v!="internalGrade")&&(v!="totalInternal")&&(v!="totalExternal")&&(v!="grade")){ //Arush Check Grade
			    				(v!="externalGrade")&&(v!="internalGrade")&&(v!="totalInternal")&&(v!="totalExternal" &&(v!="Correction"))){
			    			// Changes by arush ; Validate each component marks
			    			
			    			if (v!="grade"){  // loop v! = grade
			    						    			
			    				var idmaxmarks:number  = new Number(componentXml.component.(evaluationId==v).maximumMarks);
			    				var mrkchg:string="N";
			    				var componentMarks:number ;
			    				
			    				if (isANumber(o[v])){
			    					 componentMarks  = new Number(o[v]);
			    				}else{
			    					componentMarks = 0;
			    				}
			    			  	
			    			  	
			    			  		var prvmarks:string=getpreviousmarks(o["rollNumber"],v);
			    			  	//var prvmarks:String = o[v+"b"];
			    			  	if(prvmarks!=o[v] && prvmarks !="Z") 
			    			  	{
			    			  		mrkchg = "C";
			    			  	}else{
			    			  			mrkchg = "N";
			    			  	}			
			    				if (componentMarks > idmaxmarks)
			    				{
									Alert.show(commonFunction.getMessages('EnteredmarksmorethanMaximumMark')+ " for Roll Number: "+ 
									o["rollNumber"] + " and component: " + v
									,commonFunction.getMessages('error'),4,null,null,errorIcon);
			    					return;
			    		  				}
			    		  				if (v==''){
			    		  					v='ZZZ' // dummy number
			    		  				}
			    		  				
			    		  		
		    				 				
		    				    				
 			if(displayType=='I'){
		    				
		    				s+=o["rollNumber"]+"|"+v+"|"+componentXml.component.(evaluationId==v).idType+"|"+o[v]+"|"+o["totalInternal"]+"|"+wgrade+"|"+prvmarks+"|"+mrkchg+";";
						}else if(displayType=='E'){
		    			//	s+=o["rollNumber"]+"|"+v+"|"+componentXml.component.(evaluationId==v).idType+"|"+o[v]+"|"+o[v]+"|"+wgrade+";";
		    				s+=o["rollNumber"]+"|"+v+"|"+componentXml.component.(evaluationId==v).idType+"|"+o[v]+"|"+o["totalExternal"]+"|"+wgrade+"|"+prvmarks+"|"+mrkchg+";";
						}else {
		    				s+=o["rollNumber"]+"|"+v+"|"+componentXml.component.(evaluationId==v).idType+"|"+o[v]+"|"+o["totalMarks"]+"|"+wgrade+"|"+prvmarks+"|"+mrkchg+";";
						}
		    			
						
		    		
		    				
			    		 	}// end of loop  If Grade Limit to be used
			    		  	
			    		  		if (v=="grade" ){     // loop v== Grade
			    		  		var invalidgrade:boolean =true;	
			    		  		var s1:XML;
			    		  		var s2:string;
							  	for each (s1 in  gradeXML.gradeList.grade){
							  		
							  		s2=s1;
							  		
			    		  			if (o[v] ==s2){
			    		  			invalidgrade = 	false ;
			    		  			break;
			    		  			} 
			    		 }       // end  loop v== Grade
			    		  			
								//grade validation removed by Manpreet on 21-03-2017 for submitting sheet without grades
								
//			    			if (invalidgrade==true){   // invalid grade true
//			    			Alert.show(commonFunction.getMessages('invalidgrade')+ " for Roll Number: "+ 
//									o["rollNumber"] + " and Grade : " + o[v]
//									,commonFunction.getMessages('error'),4,null,null,errorIcon);
//									return;	
//			    			}  // end of loop invalid grade true
			    			}  // end  of  loop v! = grade
			    			
			    				// arush changes end here
			    	
			    		 			
			    			
			    		  		}
			    		
			    			
						
					}	
				}
					    		
				var params:Object=new Object();
			 	params["courseCode"]=courseCode;
				params["startDate"]=semesterStartDate;
				params["endDate"]=semesterEndDate;
			    params["programCourseKey"]=programCourseKey;
			    params["entityId"]=entityId;
			    params["employeeCode"]=employeeCode;  
			    params["status"]='SUB';
				params["displayType"]=displayType;
				params["data"]=s;
				httpSaveSheet2.send(params);
				// commented out by Arush on 14-02-2014 submit for approval request should be submitted after marks saved are successful
//				if(checkGradeField()){
//					Mask.show(commonFunction.getMessages('pleaseWait'));
//			    	httpSubmitApprovalRequest.send(params);	
//				}
//				else{
//					Alert.show(commonFunction.getMessages('fillGrade'),commonFunction.getMessages('error'),4,null,null,errorIcon);
//				}
			}
			else{
				Alert.show(commonFunction.getMessages('noStudentFound'),commonFunction.getMessages('info'),4,null,null,infoIcon);
			}
		}		    
	 }
	 
	  function resultHandlerSave2(event:ResultEvent):void{
	 	
	 	// Added by Arush  on 14-02-2014 approval should be submitted after marks saved are successful
	 	var params:Object=new Object();
			 	params["courseCode"]=courseCode;
				params["startDate"]=semesterStartDate;
				params["endDate"]=semesterEndDate;
			    params["programCourseKey"]=programCourseKey;
			    params["entityId"]=entityId;
			    params["employeeCode"]=employeeCode;  
			    params["status"]='SUB';
				params["displayType"]=displayType;
				params["data"]=s;
	 	if(checkGradeField()){
					Mask.show(commonFunction.getMessages('pleaseWait'));
			    	httpSubmitApprovalRequest.send(params);	
				}
				else{
					Alert.show(commonFunction.getMessages('fillGrade'),commonFunction.getMessages('error'),4,null,null,errorIcon);
				}
	 	
	 }
 
	 /**
	  * request handler for submit button
	  */
	  function resultHandlerSubmit(event:ResultEvent):void{
	 	var result:XML=<XML>event.result ;
	 	
	 	if(result.sessionConfirm == true){
    		Alert.show(commonFunction.getMessages('sessionInactive'),commonFunction.getMessages('error'), 4, null,null,errorIcon);
    		this.parentDocument.vStack.selectedIndex=0;
			this.parentDocument.loaderCanvas.removeAllChildren();
		}
	 	
		if(result.exception.exceptionstring == 'E'){
	   		Alert.show(commonFunction.getMessages('problemInService'),commonFunction.getMessages('error'),4,null,null,errorIcon);
		}
		else{
	  		saveButton.enabled=false;   
	   		submitForApprovalButton.enabled=false;
	   		var params:Object=new Object();
			params["courseCode"]=courseCode;
			params["startDate"]=semesterStartDate;
			params["endDate"]=semesterEndDate;
		    params["programCourseKey"]=programCourseKey;
		    params["entityId"]=entityId;
		    params["employeeCode"]=employeeCode;
			params["displayType"]=displayType; 
		    httpStatus.send(params);
		    submitForApprovalRequest(awardSheetGrid);
	   	}
	 }
	 
	 /**
     * function for generating pdf on click of SubmitForApproval Button
     */
     export function submitForApprovalRequest(awardSheetGrid:AdvancedDataGrid):void{
         var headers:string="";
         var data:string="1"+";";
         var i:number=0;
         var count:number=1;
         for each(var obj:Object in awardSheetGrid.dataProvider){
            for each(var a:AdvancedDataGridColumn in awardSheetGrid.columns){
                if(i==0){
                    headers=headers+a.headerText+'|';
                }
               
                if(obj[a.dataField]==null){
//                    data=data+"-"+";";
                    data=data+commonFunction.convertNumberToWord(obj[a.dataField.substr(0,a.dataField.length-2)])+";";
                }else if(obj[a.dataField]==""){
                    data=data+"-"+";";
                }
                else{
                    data=data+obj[a.dataField]+";";
                }
            }
            count++;
            data=data+String(count)+";";
            i++;
         }

	 	var params:Object=new Object();
	 	params["entity"]=entityId;
		params["program"]=programId;
		params["branch"]=branchId;
		params["specialization"]=specializationId;
		params["semester"]=semesterId;
		params["courseCode"]=courseCode;
	 	params["courseName"]= courseName;
	 	params["output"]="PDF";
	 	params["header"]=headers;
	 	params["data"]=data;	 	
	 	params["programCourseKey"]=programCourseKey;
		params["employeeCode"]=employeeCode; 
		params["displayType"]=displayType;
		params["entityName"]=entityName;
		params["entityTypeName"]=entityTypeName;
		params["programName"]=programName;
		params["branchName"]=branchName;
		params["specializationName"]=specializationName;
		params["semesterName"]=semesterName;
		params["sessionStartDate"]=sessionStartDate;
		params["sessionEndDate"]=sessionEndDate;
		params["employeeName"]=employeeName;		
		httpApproveRequestPdf.send(params); // request is for generate the PDF on the submit button	 	
	 }
	 
	 function resultHandlerApproveRequestPdf(event:ResultEvent):void{
		 Mask.close();
		 for each(var obj:Object in <ArrayCollection>courseListGrid.dataProvider ){
			obj.select=false;
		}
		courseListGrid.dataProvider.refresh();
		awardSheetGrid.dataProvider.refresh();
		awardSheetCanvas.visible=false;
		 Alert.show(commonFunction.getMessages('approvedSuccessfullyPdf'),commonFunction.getMessages('success'),4,null,null,successIcon);
	} 
  
	 /**
	 * function for generating pdf on click of approve button
	 */
	 export function approveRequest():void{
	 	var selectedPendingListArrCol:ArrayCollection=AdvancedGridOperations.getSelectedRowData(pendingList.pendingListGrid);
		entityId=selectedPendingListArrCol.getItemAt(0).entityId;
		entityType=selectedPendingListArrCol.getItemAt(0).entityType;
		programId=selectedPendingListArrCol.getItemAt(0).programId;
		branchId=selectedPendingListArrCol.getItemAt(0).branchId;
		specializationId=selectedPendingListArrCol.getItemAt(0).specializationId;
		semesterId=selectedPendingListArrCol.getItemAt(0).semesterCode;
		courseCode=selectedPendingListArrCol.getItemAt(0).courseCode;
		semesterStartDate=selectedPendingListArrCol.getItemAt(0).startDate;
		semesterEndDate=selectedPendingListArrCol.getItemAt(0).endDate;
		entityName=selectedPendingListArrCol.getItemAt(0).entityName;
		entityTypeName=selectedPendingListArrCol.getItemAt(0).entityTypeName;
		programName=selectedPendingListArrCol.getItemAt(0).programName;
		branchName=selectedPendingListArrCol.getItemAt(0).branchName;
		specializationName=selectedPendingListArrCol.getItemAt(0).specializationName;
		semesterName=selectedPendingListArrCol.getItemAt(0).semesterName;
		courseName=selectedPendingListArrCol.getItemAt(0).courseName;
		resultSystem=selectedPendingListArrCol.getItemAt(0).resultSystem;
		programCourseKey=selectedPendingListArrCol.getItemAt(0).programCourseKey;
		displayType = selectedPendingListArrCol.getItemAt(0).displayType;
		prevousEmployeeId = selectedPendingListArrCol.getItemAt(0).employeeId;
	 	
	 	var params:Object=new Object();
	 	params["entity"]=entityId;
	 	params["programCourseKey"]=programCourseKey;
	 	params["courseCode"]=courseCode;
	 	params["startDate"]=semesterStartDate;
		params["endDate"]=semesterEndDate;
		params["employeeCode"]=employeeCode;
		params["status"]="APR";
		params["previousStatus"]='SUB';
		params["displayType"]=displayType;
		params["requestSender"]= prevousEmployeeId;
		Mask.show(commonFunction.getMessages('pleaseWait'));
		httpApproveRequest.send(params);	 	
	 }
 
 
	  function resultHandlerApproveRequest(event:ResultEvent):void{
		 var serviceResult:XML=<XML>event.result ;
		 
		 if(serviceResult.sessionConfirm == true){
    		Alert.show(commonFunction.getMessages('sessionInactive'),commonFunction.getMessages('error'), 4, null,null,errorIcon);
    		this.parentDocument.vStack.selectedIndex=0;
			this.parentDocument.loaderCanvas.removeAllChildren();
		 }
		 
			 Alert.show(commonFunction.getMessages('approvedSuccessfully'),(commonFunction.getMessages('success')),4,null,null,successIcon);

			 var params:Object=new Object();
			 params["employeeCode"]=employeeCode;
			 params["displayType"]=displayType;
			 params["time"]=new Date().getTime();
			 vbox.removeAllChildren();
			 httpPendingRequests.send(params);
			 httpApprovedRequests.send(params);			 
			 PopUpManager.removePopUp(pendingList);
			 pendingAC.refresh();			 
			 Mask.close();
	}
	
	
	export function rejectFrame():void
	{
		rejectionPopup=RejectionReason(PopUpManager.createPopUp(this,RejectionReason,true));
		rejectionPopup.refFuncForReject=rejectRequest;
		PopUpManager.centerPopUp(rejectionPopup);
	} 
 
	/**
	 * Function for rejecting award blank
	 */
	export function rejectRequest():void{
		//reject current and all lower level requests
		var selectedPendingListArrCol:ArrayCollection=AdvancedGridOperations.getSelectedRowData(pendingList.pendingListGrid);
		entityId=selectedPendingListArrCol.getItemAt(0).entityId;
		entityType=selectedPendingListArrCol.getItemAt(0).entityType;
		programId=selectedPendingListArrCol.getItemAt(0).programId;
		branchId=selectedPendingListArrCol.getItemAt(0).branchId;
		specializationId=selectedPendingListArrCol.getItemAt(0).specializationId;
		semesterId=selectedPendingListArrCol.getItemAt(0).semesterCode;
		courseCode=selectedPendingListArrCol.getItemAt(0).courseCode;
		semesterStartDate=selectedPendingListArrCol.getItemAt(0).startDate;
		semesterEndDate=selectedPendingListArrCol.getItemAt(0).endDate;
		entityName=selectedPendingListArrCol.getItemAt(0).entityName;
		entityTypeName=selectedPendingListArrCol.getItemAt(0).entityTypeName;
		programName=selectedPendingListArrCol.getItemAt(0).programName;
		branchName=selectedPendingListArrCol.getItemAt(0).branchName;
		specializationName=selectedPendingListArrCol.getItemAt(0).specializationName;
		semesterName=selectedPendingListArrCol.getItemAt(0).semesterName;
		courseName=selectedPendingListArrCol.getItemAt(0).courseName;
		resultSystem=selectedPendingListArrCol.getItemAt(0).resultSystem;
		programCourseKey=selectedPendingListArrCol.getItemAt(0).programCourseKey;
		displayType = selectedPendingListArrCol.getItemAt(0).displayType;
		prevousEmployeeId = selectedPendingListArrCol.getItemAt(0).employeeId;
		
		if(Validator.validateAll([rejectionPopup.reasonValidator]).length==0){
			var params:Object=new Object();
		 	params["entity"]=entityId;
			params["status"]="REJ";
		 	params["programCourseKey"]=programCourseKey;
		 	params["startDate"]=semesterStartDate;
			params["endDate"]=semesterEndDate;
			params["employeeCode"]=employeeCode; 
			params["courseCode"]=courseCode;
			params["displayType"]=displayType;
			params["reason"]=rejectionPopup.reasonText.text;
	 		Mask.show(commonFunction.getMessages('pleaseWait'));
			httpRejectRequest.send(params);
		}
		else{
			rejectionPopup.reasonText.errorString="";
		}
		
	}

	 function resultHandlerRejectRequest(event:ResultEvent):void{   
		
		 if(event.result.sessionConfirm == true){
    		Alert.show(commonFunction.getMessages('sessionInactive'),commonFunction.getMessages('error'), 4, null,null,errorIcon);
    		this.parentDocument.vStack.selectedIndex=0;
			this.parentDocument.loaderCanvas.removeAllChildren();
		 }
		
		var params:Object=new Object();
	 	params["employeeCode"]=employeeCode;
	 	params["displayType"]=displayType;
	 	params["time"]=new Date().getTime();
	 	vbox.removeAllChildren();
		httpPendingRequests.send(params);
		httpApprovedRequests.send(params);
		PopUpManager.removePopUp(pendingList);
		PopUpManager.removePopUp(rejectionPopup);
		pendingAC.refresh();
		Mask.close();
	   	Alert.show(commonFunction.getMessages('recordRejectedSuccessfully'),(commonFunction.getMessages('success')),4,null,null,successIcon);   
	 }
	
	 function withdrawConfirm():void{
		Alert.show(commonFunction.getMessages('areyousure'),commonFunction.getMessages('confirm'),3,null,withdrawSheet,questionIcon);
	}
	
	/**
	 * Function for withdrawing award blank previously submitted
	 */
	export function withdrawSheet(event:CloseEvent):void{
		if(event.detail==Alert.YES){
			var params:Object=new Object();
		 	params["courseCode"]=courseCode;
			params["startDate"]=semesterStartDate;
			params["endDate"]=semesterEndDate;
		    params["programCourseKey"]=programCourseKey;
		    params["entityId"]=entityId;
		    params["employeeCode"]=employeeCode;  
		    params["status"]='WDW';
		    params["displayType"]=displayType;
		    Mask.show(commonFunction.getMessages('pleaseWait'));
		    httpWithdrawRequest.send(params);
		}    
	}
	
	
    /**
     * request handler for withdraw button
     */
	 function resultHandlerWithdraw(event:ResultEvent):void{
		var result:XML=<XML>event.result ;
		
		 if(result.sessionConfirm == true){
    		Alert.show(commonFunction.getMessages('sessionInactive'),commonFunction.getMessages('error'), 4, null,null,errorIcon);
    		this.parentDocument.vStack.selectedIndex=0;
			this.parentDocument.loaderCanvas.removeAllChildren();
		 }
		
		if(result.exception.exceptionstring == 'E'){
	   		Alert.show(commonFunction.getMessages('problemInService'),commonFunction.getMessages('error'),4,null,null,errorIcon);
		}
		else{
			//result.exception.exceptionstring (this string contains no of record updated)
	  		withdrawButton.enabled=false; 
	   		Alert.show(commonFunction.getMessages('withdrawsuccessfully') ,commonFunction.getMessages('success'),4,null,null,successIcon);
	   		var params:Object=new Object();
			params["courseCode"]=courseCode;
//			params["startDate"]=semesterStartDate;
//			params["endDate"]=semesterEndDate;
		    params["programCourseKey"]=programCourseKey;
		    params["entityId"]=entityId;
//		    params["employeeCode"]=employeeCode;
			params["displayType"]=displayType; 
//		    httpStatus.send(params);
//		    
//
//		getAprStatus.send(params);
			getApprovalOrder.send(params);
		
		
	   	}
	   	Mask.close();
	}

	/**
	 * Functions for calculating total
	 */
		export function getbest(myArray:any[],rule:string):number{
		myArray.sort(Array.NUMERIC);
		
		var maxValue1:number =myArray.pop();
		var maxValue2:number =myArray.pop();
		var maxValue3:number =myArray.pop();
		var maxValue4:number =myArray.pop();
		var maxValue5:number =myArray.pop();
		
		var max:number =0;
		if(rule == "BT1" ){
			 max=maxValue1 ;
		} else if(rule == "BT2" ){
		   max=maxValue1+maxValue2;	
		} else if(rule == "BT3" ){
		   max=maxValue1+maxValue2+maxValue3;	
		} else if(rule == "BT4" ){
		   max=maxValue1+maxValue2+maxValue3+maxValue4;	
		} else if(rule == "BT5" ){
		   max=maxValue1+maxValue2+maxValue3+maxValue4+maxValue5;	
		} else{
			max=maxValue1+maxValue2;
		}
		
	
		return	max;
	}

	export function getTotal(row:Object,col:AdvancedDataGridColumn):string
	{
		var myArray:any[]=new Array();
		var tempArray:any[]=new Array();
		var rule:string = "";
		var myArray:any[]=new Array();
				var total:number=0;
		
	    for each(var obj2:Object in componentAC){ //loop 03
	       
			var groupName:string=obj2.group;
			if(tempArray.indexOf(groupName)<0){	 //loop 02
		
		
			   	var arr:Object=new Object();
			   	
			   	var i:number=0;
			   	rule = obj2.rule;
			   	for each(var obj3:Object in componentAC){ // start loop 01
					if(groupName==obj3.group){
						if(obj3.idType=='MK'){
							arr[i++]=obj3.evaluationId;
			   			}
			   		}
			   	}// end for loop 01
			   	tempArray.splice(0);
			   	myArray.splice(0) ;
				tempArray.push(groupName);
				myArray.push(arr);
	//		}  	
	//	}  
			
		//var total:int=0;
		for each(var ac:Object in myArray){			
			var arr1:any[]=new Array();	
			for each(var o:string in ac){
				if(isANumber(row[o])){
				arr1.push(int(row[o]));	
				}else{
					arr1.push("0");
				}
				
			}
			
			
			
			total=total+getbest(arr1,rule);
		}
		}//loop 02
	    }//loop 03
		if(displayType=='I'){
		row["totalInternal"]=total;
		}else if(displayType=='E'){
			row["totalExternal"]=total;
		}else{
			row["totalMarks"]=total;
		}
		return	total+"";
	}
	
	
	export function requestpending():boolean{
		for each(var Obj:Object in abcbk){
			var base:string =Obj.Correction ;
			msg=Obj.rollNumber;
			
			var start:number =base.indexOf("PEN", start+3);
			if (start != -1){
				return true;
			}
		
		}
		
		return false ;
		
		
	}


//Manpreet 10-3-2016

export function init():void {
	timerObject = new Timer(TIMER_INTERVAL);
	timerObject.addEventListener(TimerEvent.TIMER, updateTimer);
}


export function startTimer():void {
	init();	
	baseTimer = getTimer();
	timerObject.start();	
}

export function stopTimer():void {
	timerObject.stop();
	timerObject=null;
}
 function updateTimer(evt:TimerEvent):void {
	var ms:number = getTimer() - baseTimer;
	var currentTimeObject:Date = new Date(0, 0, 0, 0, 0, 0, ms);
	if(awardSheetGrid.visible!=true){
			stopTimer();
	}
	
//		Alert.show(dateFormatter.format(currentTimeObject)+"|"+commonFunction.getMessages('saveMarksRequestSendTime'));
	
	if((dateFormatter.format(currentTimeObject)==commonFunction.getMessages('saveMarksRequestSendTime'))&& (saveButton.enabled==true)){		

		if(awardSheetGrid.visible==true){
			
			stopTimer();
			startTimer();
//			saveMarks("auto");
			getupdatedgradeForSave("auto"); //Manpreet 16-05-2016
		}else{
			stopTimer();
		}
	
	}
