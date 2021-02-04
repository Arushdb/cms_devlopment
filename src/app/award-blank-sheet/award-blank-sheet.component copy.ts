import { HttpParams } from '@angular/common/http';
import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ColDef, GridOptions, GridReadyEvent, ValueSetterParams } from 'ag-grid-community';
import { UserService } from '../services/user.service';
import {Location} from '@angular/common';

import { AgGridAngular } from 'ag-grid-angular';
import { isUndefined } from 'typescript-collections/dist/lib/util';
import { parse ,isAfter} from 'date-fns';
import { NumeriCellRendererComponent } from '../numeri-cell-renderer/numeri-cell-renderer.component';
import { CellChangedEvent } from 'ag-grid-community/dist/lib/entities/rowNode';
//import {awardsheetmodel} from './award-blank-sheet-model'




@Component({
  selector: 'app-award-blank-sheet',
  templateUrl: './award-blank-sheet.component.html',
  styleUrls: ['./award-blank-sheet.component.css']
})

       
export class AwardBlankSheetComponentcopy implements OnInit {
  @ViewChild('agGrid') agGrid: AgGridAngular;
  @ViewChild('mkGrid') mkGrid: AgGridAngular;

  
   mydefaultColDef: {
    editable: true,
    sortable: true,
    flex: 1,
    minWidth: 100,
    filter: true,
    resizable: true,
    
    };

    submitForApprovalButton:boolean=false;
    saveButton:boolean=false;
    gradelimitButton:boolean=false; 
 
 trigger:String="button";
  abc:any[]=[];
  abcbk:any[]=[];       
  editing = false;
  //columnDefsmk:ColDef[]=[];  
  buttonPressed:string=null;
  componentAC:any[];
  columnDefs: ColDef[]; 
  studentXml:any[]=[];
  public columnDefsmk : ColDef[]=[];                             
    size=0;                            
  urlPrefix:any;
  param = new HttpParams()
  .set('application','CMS');
  public myrowData=[];
  displayType:any;
  awardsheet_params:HttpParams=new HttpParams();
  gridOptions: GridOptions;
  gridOptionsmk: GridOptions;
  isEdit=false;
  isCheck=true;
  edit='Dont Edit';
  public defaultColDef;
 
  
  

  LoggedInUser: any;
  public courseListGrid=[];
  gradelimitdetail: boolean;
  courseapprstatus: boolean;
  currentApprovalOrder: any;
  style: { width: string; height: string; flex: string; };
  displaymkgrid: boolean=false;
  saveCaller: string;
  gradelimitarraycoll: any[];
  gradelimit: string;
  employeeCode: any;
  sheetstatus: any;
  

  constructor(
    private router:Router,
    private userservice:UserService,
    private _Activatedroute:ActivatedRoute,
    private elementRef:ElementRef,
   
    private location:Location,
    public dialog: MatDialog,
    private renderer:Renderer2,

    ) { 
      this.gridOptions = <GridOptions>{
        enableSorting: true,
        enableFilter: true               
      } ;
      this.gridOptionsmk = <GridOptions>{
        enableSorting: true,
        enableFilter: true               
      } ;


      this.defaultColDef = {
        resizable: true,
        sortable: true,
        filter: true
           
    };

      const columns = ['Seq_No','courseCode', 'courseName', 'entityName'];
      this.setColumns(columns);

  }

  ngOnInit(): void {

  
    this.gridOptions.columnDefs=this.columnDefs;

    this.moduleCreationCompleteHandler();
  
  }

  hashValueGetter = function (params) {
  
    return params.node.rowIndex+1;
  };
  
  moduleCreationCompleteHandler():void{

  this._Activatedroute.data.subscribe(data => { 
    
    this.displayType = data.displayType;
    this.urlPrefix="/awardsheet/"; 
    this.param=this.param.set('displayType',this.displayType);
    

    this.employeeCourseHttpService(this.param);
  
});
		

		
	
  }

 
  
  employeeCourseHttpService(param){
    let obj = {xmltojs:'Y',
    method:'None' };   
  obj.method='/awardsheet/getCourseList.htm';
  
  this.userservice.getdata(param,obj).subscribe(res=>{
    //this.userservice.log(" in switch detail selected");
    res = JSON.parse(res);
    this.employeeCourseHttpServiceResultHandler(res);
   
})
  }


  httpEmployeeCode(param){
    let obj = {xmltojs:'Y',
    method:'None' };   
  obj.method='/awardsheet/getEmployeeCode.htm';
  
  this.userservice.getdata(param,obj).subscribe(res=>{
    //this.userservice.log(" in switch detail selected");
    res = JSON.parse(res);
    this.resultHandlerEmployeeCode(res);
  
})
   

    
  }
  resultHandlerEmployeeCode(res){

  }

   employeeCourseHttpServiceResultHandler(res):void{

  

    var employeeCourse =res;
  
if (this.displayType=="I"){
			
		} else if (this.displayType=="E"){
			//courselabel.text = "Select Course to enter External Marks " ;
		}else{
			//courselabel.text = "Select Course to enter Remedial " ;
		}
    
    if(employeeCourse.hasOwnProperty("Details")){
		//if(!(isUndefined(employeeCourse.Details.sessionConfirm))){

   
		if(employeeCourse.Details.sessionConfirm == true){
    		//Alert.show(commonFunction.getMessages('sessionInactive'),commonFunction.getMessages('error'), 4, null,null,errorIcon);
    	// 	this.parentDocument.vStack.selectedIndex=0;
      // this.parentDocument.loaderCanvas.removeAllChildren();
      this.userservice.log("Session In Active");
      return;
      }
    } 
		
    //var param:Object =new Object();
    this.awardsheet_params = this.awardsheet_params.set("time",new Date().toString())
	 	//param["time"]=new Date();
    //gradeHttpService.send(param);
    let param= new HttpParams();
    param.set("time",new Date().toString());
		this.gradeHttpService();
		if(String(employeeCourse+"").length==0){
			this.httpEmployeeCode(param);
		}
		else{
      //employeeCourseArrCol=new ArrayCollection();
      
    let  employeeCourseArrCol=[];

    var count=0;
      
		//	for (var obj of employeeCourse.root){
			for (var obj of employeeCourse.CodeList.root){
				employeeCourseArrCol.push({select:false,entityId:obj.entityId, programId:obj.programId, programName:obj.programName, 
				branchId:obj.branchId, branchName:obj.branchName, specializationId:obj.specializationId, 
				specializationName:obj.specializationName, semesterCode:obj.semesterCode, semesterName:obj.semesterName, 
				semesterStartDate:obj.semesterStartDate, semesterEndDate:obj.semesterEndDate, courseCode:obj.courseCode, 
				courseName:obj.courseName, programCourseKey:obj.programCourseKey, resultSystem:obj.resultSystem, 
				employeeCode:obj.employeeCode, entityType:obj.entityType, entityName:obj.entityName, 
        startDate:obj.startDate, endDate:obj.endDate, employeeName:obj.employeeName,
         gradelimit:obj.gradelimit,createrId:obj.creatorId,Marks:""});
			this.LoggedInUser=obj.creatorId;
      
    count++}
			//employeeCourseArrCol
      //courseListGrid.dataProvider=null;
     
      this.courseListGrid=employeeCourseArrCol;
      this.employeeCode=employeeCourseArrCol[0].employeeCode;
     
     //this.gridOptions.rowData =this.courseListGrid;
      //** for testing

      //this.gridOptions.api.setColumnDefs(this.columnDefs);
      this.gridOptions.api.setRowData(this.courseListGrid);

      
       

    //  );
      
     

      

      
     
		}
	}
	
  

  OngridReady(parameters:GridReadyEvent){

  
   
      this.defaultColumnDefs();
          this.style = {
            width: '100%',
            height: '100%',
            flex: '1 1 auto'
        };
      

    this.gridOptionsmk.api.setColumnDefs(this.columnDefsmk);
    this.gridOptionsmk.api.setRowData(this.abc);
  
    
       
  }



  gradeHttpService(){
    let obj = {xmltojs:'Y',
    method:'None' };   
  obj.method='/awardsheet/getGrades.htm';
  
  this.userservice.getdata(this.awardsheet_params,obj).subscribe(res=>{
    //this.userservice.log(" in switch detail selected");
    res = JSON.parse(res);
    this.gradeHttpServiceResultHandler(res);
    
})
    
  }

  gradeHttpServiceResultHandler(res){
		//gradeXML =  event.result as XML;
		let gradeXML = res;
		
	

		  	
		//Mask.close();
		if(gradeXML.sessionConfirm == true){
    	// 	Alert.show(commonFunction.getMessages('sessionInactive'),commonFunction.getMessages('error'), 4, null,null,errorIcon);
    	// 	this.parentDocument.vStack.selectedIndex=0;
      // this.parentDocument.loaderCanvas.removeAllChildren();
      
      this.userservice.log("session Inactive");
		}
	}
	



 getupdatedgradeForSave(callingMethod:string):void{
//	Alert.show(callingMethod);
	this.saveCaller=callingMethod;
	var param:Object =new Object();
	var gradeobject:Object=new Object();
		this.httprequestgetupdatedgradelimitForSave() ;
	
}

httprequestgetupdatedgradelimitForSave(){
  let obj = {xmltojs:'Y',
  method:'None' };   
obj.method='/awardsheet/getgradelimit.htm';

this.userservice.getdata(this.awardsheet_params,obj).subscribe(res=>{
  //this.userservice.log(" in switch detail selected");
  res = JSON.parse(res);
  this.getupdatedgradelimitForSaveResultHandler(res);
});
}

getupdatedgradelimitForSaveResultHandler(res){

  
  this.gradelimitarraycoll=[];
  if(isUndefined(res.root)){

  }else{
    this.gradelimitarraycoll=[];
    for (var obj of  res.root){
      this.gradelimitarraycoll.push({coursecode:obj.courseCode,grades:obj.grades ,marksfrom:obj.marksfrom,marksto:obj.marksto});	
    }
  }
  
	if (this.gradelimitarraycoll.length== 0){
		//Alert.show(commonFunction.getMessages('gradeLimitNotExist'),commonFunction.getMessages("info"),4,null,null,infoIcon) ;
		this.gradelimitdetail = false ;
		
	}else{
		
	}
	
	this.saveMarks(this.saveCaller);
}




onRowSelected(event){
 
  if(this.gridOptions.api.getSelectedNodes().length>1){
    this.userservice.log("Please select only One");
    this.gridOptions.api.deselectAll();
    return;
  }
        
  if(event.node.selected){
    
   
    this.displaymkgrid=true;
    this.columnDefsmk =[]; 
    this.componentAC=[];

   this.furtherExecution(event);
  
   

  }else{
   //this.gridOptionsmk.api.destroy();
  
    this.columnDefsmk =[];
    this.displaymkgrid =false;
  }
        
    

}
  furtherExecution(event):void{
   
		this.awardsheet_params=this.awardsheet_params.set("courseCode",event.data.courseCode);
		this.awardsheet_params=this.awardsheet_params.set("entityId",event.data.entityId);
		this.awardsheet_params=this.awardsheet_params.set("programCourseKey",event.data.programCourseKey);
    this.awardsheet_params=this.awardsheet_params.set("courseCode",event.data.courseCode);
    this.awardsheet_params=this.awardsheet_params.set("displayType",this.displayType);
    this.awardsheet_params=this.awardsheet_params.set("sessionstartdt",event.data.startDate);
    this.awardsheet_params=this.awardsheet_params.set("sessionenddt",event.data.endDate);
    this.awardsheet_params=this.awardsheet_params.set("semesterstartdt",event.data.semesterStartDate);
    this.awardsheet_params=this.awardsheet_params.set("semesterenddt",event.data.semesterEndDate);
    this.awardsheet_params=this.awardsheet_params.set("programId",event.data.programId);
    this.awardsheet_params=this.awardsheet_params.set("branchCode",event.data.branchId);
    this.awardsheet_params=this.awardsheet_params.set("specCode",event.data.specializationId);
    this.awardsheet_params=this.awardsheet_params.set("semesterCode",event.data.semesterCode);
    this.awardsheet_params=this.awardsheet_params.set("startDate",event.data.semesterStartDate);
    this.awardsheet_params=this.awardsheet_params.set("endDate",event.data.semesterEndDate);
    this.awardsheet_params=this.awardsheet_params.set("employeeCode",this.employeeCode);
    this.awardsheet_params=this.awardsheet_params.set("selEmployeeName",event.data.employeeName);
    
		 	if (event.data.gradelimit=='1')
          this.httprequestgetgradelimit() ;
          this.httpStatus();
        											
	}
	
  httprequestgetgradelimit() {


      let obj = {xmltojs:'Y',
      method:'None' };   
      obj.method='/awardsheet/getgradelimit.htm';
  
      this.userservice.getdata(this.awardsheet_params,obj).subscribe(res=>{
    //this.userservice.log(" in switch detail selected");
      res = JSON.parse(res);
      this.getgradelimitResultHandler(res);
  
})
    //getgradelimit.htm
  }
  
 
   getgradelimitResultHandler(res){
    
    let param:HttpParams =new HttpParams();

		
      this.gradelimitarraycoll = [];
     
      if(isUndefined(res.CodeList.root)){
        this.gradelimitdetail = false ;

      }else{
    
    
		for (var obj of res.CodeList.root){
		this.gradelimitarraycoll.push({coursecode:obj.courseCode,grades:obj.grades ,marksfrom:obj.marksfrom,marksto:obj.marksto});	
    }
  }
   
    if (this.gradelimitarraycoll.length== 0){
			//Alert.show(commonFunction.getMessages('gradeLimitNotExist'),commonFunction.getMessages("info"),4,null,null,infoIcon) ;
			this.gradelimitdetail = false ;
		
		}
		
		this.gradelimitdetail = true ;
		this.httprequestgetcourseAprStatus();
  }
  
	httprequestgetcourseAprStatus(){
    //getcourseAprStatus.htm
    //result="getcourseAprStatusResultHandler(event)"

    let obj = {xmltojs:'Y',
    method:'None' };   
  obj.method='/awardsheet/getcourseAprStatus.htm';
 // console.log(params);
  
  this.userservice.getdata(this.awardsheet_params,obj).subscribe(res=>{
    //this.userservice.log(" in switch detail selected");
    res = JSON.parse(res);
    this.getcourseAprStatusResultHandler(res);
  
})


  }
	
  

   getcourseAprStatusResultHandler(res):void{
    if(isUndefined(res.root)){
      this.userservice.log("No Approver assigned");
      
    }
		//courseapprstatusarraycoll.removeAll();
    let courseapprstatusarraycoll = [];
    
    if(isUndefined(res.root)){
    }else{

    
		for(let obj of res.root){
        courseapprstatusarraycoll.push({coursecode:obj.courseCode,entityId:obj.entityId ,requestSender:obj.requestSender,requestGetter:obj.requestGetter
        ,requestdate:obj.requestdate,completiondate:obj.completiondate,approvalOrder:obj.approvalOrder,status:obj.status,
        requestSendername:obj.requestSendername,requestgettername:obj.requestgettername,requestSenderdesignation:obj.requestSenderdesignation
        ,requestGetterdesignation:obj.requestGetterdesignation,
        submitdates:obj.submitdates}
	      	);	
        }
      }
		this.courseapprstatus = true ;
		if (courseapprstatusarraycoll.length== 0){
			//Alert.show(commonFunction.getMessages('gradeLimitNotExist'),commonFunction.getMessages("info"),4,null,null,infoIcon) ;
			this.courseapprstatus = false;
			
		}
		
    this.httpIsNextApprovalOrderExist();

  }
  
	httpIsNextApprovalOrderExist(){
    let obj = {xmltojs:'Y',
    method:'None' };   
  obj.method='/awardsheet/isNextApprovalExist.htm';
  
  this.userservice.getdata(this.awardsheet_params,obj).subscribe(res=>{
    //this.userservice.log(" in switch detail selected");
    res = JSON.parse(res);
    this.httpIsNextAppOrderExistResultHandler(res);
  
})

  }



 httpIsNextAppOrderExistResultHandler(res):void{
		//var xmlData:XML = event.result as XML;
	
		if(res.info.result[0].message=="approvalOrderNotExist"){
      //Alert.show(commonFunction.getMessages('setAtleastTwoAppOrder'), commonFunction.getMessages("info"),4,null,null,infoIcon);
      this.userservice.log("Set at least two App order");
      return;
		}
		else{

		this.getApprovalOrder();
        
      this.setButtonPressed('SW');
      this.setVariables();
			
		}
  }
  

	getApprovalOrder(){
    let obj = {xmltojs:'Y',
    method:'None' };   
  obj.method='/awardsheet/getApprovalOrder.htm';
  
  this.userservice.getdata(this.awardsheet_params,obj).subscribe(res=>{
    //this.userservice.log(" in switch detail selected");
    res = JSON.parse(res);
    this.httpGetApprovalOrder(res);

})

  }

 

  httpGetApprovalOrder(res){
    if(res.CodeList.root.length<=0){

     
      this.userservice.log("No Approvar exists");
      return;

    }

  	this.currentApprovalOrder = res.CodeList.root[0].approvalOrder;
  
   this.awardsheet_params=this.awardsheet_params.set("approvalOrder",this.currentApprovalOrder);
    
   	
		this.getAprStatus();
  	
  }
  getAprStatus(){
    let obj = {xmltojs:'Y',
    method:'None' };   
    obj.method='/awardsheet/getAprStatus.htm';
  
  this.userservice.getdata(this.awardsheet_params,obj).subscribe(res=>{
    //this.userservice.log(" in switch detail selected");
    res = JSON.parse(res);
    this.httpAprStatusService(res);
  
})
    }

    httpAprStatusService(res){

    let resp_status=false; 
     
    
    if(res.info.trim()===""){
      resp_status =false;
    }else{
      resp_status=true;
    }
  console.log(resp_status,res.result.message);
     
      try
      {
        if(res.result.sessionConfirm == true &&resp_status)
        {
         //  Alert.show(resourceManager.getString('Messages','sessionInactive'));
          var url:String="";
          //url=commonFunction.getConstants('navigateHome');
          //var urlRequest:URLRequest=new URLRequest(url);
          //urlRequest.method=URLRequestMethod.POST;
          //navigateToURL(urlRequest,"_self");
        }
      }
       catch(e){}
       //downloadButton.visible=false;
         //uploadButton.visible=false;
       if(resp_status&&(res.result.message=="SUB" || res.result.message=="APR" )){
       
        // downloadButton.visible=false;
         //uploadButton.visible=false;
         this.gradelimitButton=false ;
       }
       else{
       //	downloadButton.visible=true;  access removed  as requested by examination 
         this.gradelimitButton=true ;
       //	uploadButton.visible=true;  access removed  as requested by examination
       }
       if(this.displayType=="E"){
        //var params:Object = new Object();
        // params["courseCode"]=courseCode;
        // params["sessionStartDate"]=sessionStartDate;
        //    params["sessionEndDate"]=sessionEndDate;
        this.httpIsExtAwardAllowed();	
      }
      else{
        // setButtonPressed('SW');
        // setVariables();
      }
  

   
    }
    httpIsExtAwardAllowed(){
  

    };	


    setButtonPressed(status){

      
      this.buttonPressed=status;
  }
   setVariables(){
  
      if(this.buttonPressed==='SW'){ // show button
 
  
          this.getEvaluationComponents();			
      }
  }
  
      getEvaluationComponents(){
  
  
          let obj = {xmltojs:'Y',
          method:'None' };   
        obj.method='/awardsheet/getEvaluationComponents.htm';
        
        this.userservice.getdata(this.awardsheet_params,obj).subscribe(res=>{
          //this.userservice.log(" in switch detail selected");
          res = JSON.parse(res);
          this.resultHandlerComponent(res);
        
      })
  
         
  
      }
  
      resultHandlerComponent(res){
  
  
          this.componentAC = [];
         let  flag:Boolean=true;
       
          for (let object of res.ComponentList.component){
              this.componentAC.push({evaluationId:object.evaluationId,evaluationIdName:object.evaluationIdName,group:object.group,
              rule:object.rule,idType:object.idType,displayType:object.displayType,maximumMarks:object.maximumMarks,componentType:object.componentType});
          }
  
         
          if(this.componentAC.length==0){
          }
          else{	
              
              this.httpStudentList();
   }
  
      }

      httpStudentList(){

        let obj = {xmltojs:'Y',
        method:'None' };   
      obj.method='/awardsheet/getStudentList.htm';
      
      this.userservice.getdata(this.awardsheet_params,obj).subscribe(res=>{
        //this.userservice.log(" in switch detail selected");
        res = JSON.parse(res);
        this.resultHandlerStudent(res);
      
    })

      }
      resultHandlerStudent(res){

     
      if(isUndefined(res.StudentList.student)){
        this.userservice.log("No Student Exists");
        return;
      }

        this.studentXml=[];
     
        this.studentXml=res.StudentList.student;
    		
	  	this.getStudentMarks();
      

      }

      getStudentMarks(){
        this.httpStudentMarksList();

      }

      httpStudentMarksList(){
        let obj = {xmltojs:'Y',
        method:'None' };   
        obj.method='/awardsheet/getStudentMarks.htm';
      
        let sub=this.userservice.getdata(this.awardsheet_params,obj).subscribe(res=>{
        //this.userservice.log(" in switch detail selected");
        res = JSON.parse(res);
        this.resultHandlerStudentMarks(res);
        sub.unsubscribe();
      
    })
        
        
      }
      resultHandlerStudentMarks(res){
    
      this.submitForApprovalButton=true;
  
 		var resultObj:Object=new Object();
 		    let dataProviderList:any[] =[]; 
    
        let studentMarksListAC:any[]=[];
       let markspublish:any[]=[];
  
     this.abc=[];
     this.abcbk=[];
	
		
        
   		for  (var obj1 of  this.studentXml){
   			var resultObj:Object=new Object();
   			
   			
   			var _s1:string=obj1.rollNumber;
   		//	resultObj["rollNumber"]=obj1.rollNumber;
   		    resultObj["rollNumber"]=_s1;
                		
   			resultObj["studentName"]=obj1.studentName;
   			
   			
   			//Alert.show("marks"+marksXml);
   			resultObj["totalInternal"]= "0";
			resultObj["totalExternal"]="0";
			resultObj["totalMarks"]="0";
			resultObj["grade"]="";
			resultObj["Correction"]="";
			resultObj["rowchanged"]="N";

			for (var obj3 of  this.componentAC){
			var s4: string = obj3.evaluationId;
			resultObj[obj3.evaluationId]="Z";
			}


   			var cVal:string="";
   			var cVal1:string="";
   			var cVal2:string="";// for down load  arush 
   			var grade:string="";

   			var studentexist:Boolean = false;
   			var publishdate:Object=new Object();
         
         if(String(res.MarksList).trim()===""){

         }else{
             
   			for (var obj2 of  res.MarksList.marks){

         

   				
   				  var _dateinsert:string =""; 
   					var _datemodified:string = "";
   					var _publishdate:string="";
   					var _dateins:Date = new Date();
   					var _datemod:Date=new Date() ;
   				//	var res:Number;
   					var resn:Number;
   				
           publishdate = new Object();
        
   				if(String(obj1.rollNumber).toString()===String(obj2.rollNumber).toString()){
          
             studentexist=true;
          
   					var cValue:string="";
   					
   					if(String(obj2.attendence).toUpperCase()=== "ABS" ){
   						cValue="A" ;
   					}else{
   				   				   					
   					if(obj2.marks!="" ){
   						cValue=obj2.marks;
   					}else if(obj2.grades!=""){
   						cValue=obj2.grades;
   					}else{
   						cValue=obj2.passfail;
   					}
					if(cValue=="" || cValue==null){
						cVal1="0";
//						cVal="0";
            cValue = "Z";
            this.submitForApprovalButton=false;
					}
					else{
						cVal1=cValue;
					}
					}
   				
					//Alert.show("cValue is name is "+obj1.studentName+" :  "+cValue.toString()+" : "+obj2.evaluationId);
					
   					resultObj[obj2.evaluationId]=cValue;

   	   					   					
   					if (cValue!="Z"){
   					_dateinsert = obj2.inserttime;
   					_datemodified = obj2.modificationtime;
   				   						
   									
				   					if (_dateinsert == ""){
				   					_publishdate = _dateinsert ;
				   						
				   					}else if (_datemodified !=""){
									   					// _datemod=DateField.stringToDate(_datemodified,"YYYY-MM-DD");
                               // _dateins=DateField.stringToDate(_dateinsert,"YYYY-MM-DD");	
                               _datemod =parse(_datemodified,'yyyy-mm-dd',new Date());
                               _dateins =parse(_dateinsert,'yyyy-mm-dd',new Date());

                               //res=compare(_datemod,_dateins);
                               
				   										if (!isAfter(_dateins,_datemod)){
				   										_publishdate = _dateinsert;
				   										}else {
				   										_publishdate = _datemodified;
				   										}
				  		
				   										}
				   					else{
				   						_publishdate = _dateinsert ;
				   					}
				   					
   					}
   					publishdate[obj2.evaluationId]=_publishdate;
   					//setpublishdate(markspublish,obj2.evaluationId,publishdate);



   					cVal=cVal1+"/"+obj2.evaluationId+"-"+cVal;
   					cVal2=cVal1+"/"+obj2.evaluationId+"#"+cVal2; // use # as sep. - is causing issue when student grades  are in negative eg. A-,B- arush
//   					Alert.show("cVal :" + cVal + "cVal1 :" + cVal1 + "cVal2 :" + cVal2 + "cValue :" + cValue);
				if (obj2.requestedmarks==null || obj2.requestedmarks==""){
				
				}else{
					resultObj["Correction"] += obj2.requestedmarks+"|"+obj2.evaluationId+"|"+ obj2.requesterremarks+"|"+ obj2.issuestatus+"|";
					
                  
					
				}
				

   					
   					if (obj2.totalExternal==null || obj2.totalExternal==""){
   						
   						resultObj["totalExternal"]="0";
   					}else{
   						resultObj["totalExternal"]=obj2.totalExternal;
   					}
   					
     					if (obj2.totalInternal==null || obj2.totalInternal==""){
   						
   						resultObj["totalInternal"]="0";
   					}else{
   						resultObj["totalInternal"]=obj2.totalInternal;
   					}
   					
     					if (obj2.totalMarks==null || obj2.totalMarks==""){
   						
   						resultObj["totalMarks"]="0";
   					}else{
   						resultObj["totalMarks"]=obj2.totalMarks;
   					} 					 					
   					
   					
//   					resultObj["totalExternal"]=obj2.totalExternal;
//   					resultObj["totalInternal"]=obj2.totalInternal;
//   					resultObj["totalMarks"]=obj2.totalMarks;
            console.log((String(obj2.internalGrade).toString()==="X"));
            console.log((this.displayType.toString()==="I"));
   					if(this.displayType.toString()==="I"){ 
   						resultObj["grade"]=obj2.internalGrade;	
						grade=obj2.internalGrade;
						if(String(obj2.internalGrade).toString()==="X"){
   						this.submitForApprovalButton=false ;
   						//gradesCalculated="0";
   						}else{
   							//gradesCalculated="1";
   						}
						
   					}
   					else if(this.displayType.toString()==="E"){
   						resultObj["grade"]=obj2.externalGrade;
						//grade=obj2.internalGrade;  Arush
						grade = obj2.externalGrade ;
						if (String(obj2.externalGrade).toString()==="X"){
   						this.submitForApprovalButton=false ;
   						}
   					}
   					else{
//   						resultObj["grade"]=obj2.internalGrade;
//						grade=obj2.internalGrade;
// Changed by Dheeraj for getting grades from student_marks table 
						//resultObj["grade"]=obj2.grades; // Arush on 13/05/2015
						resultObj["grade"]=obj2.internalGrade;
						//grade=obj2.grades; // Arush on 13/05/2015
						grade=obj2.internalGrade; // Arush on 13/05/2015
						//if (obj2.grades=="X"){  //// Arush on 13/05/2015
						if (String(obj2.internalGrade).toString()==="X"){   // Arush on 13/05/2015
   						this.submitForApprovalButton=false ;
   					}
						
   					}
   					


 //  				}
   			}

         }
        }
   			for  (const key in  resultObj){
          
   				if(resultObj[key] =="Z"){
   					_publishdate = "";
   					publishdate[key]=_publishdate;
   					//setpublishdate(markspublish,str,publishdate);
   				}
   			}
   			
       
   			this.abc.push(resultObj);
        if(this.columnDefsmk.length>0)
         this.gridOptionsmk.api.setRowData(this.abc);

        if(this.sheetstatus==="APR" ||this.sheetstatus==="SUB"){
          this.submitForApprovalButton=false;
          this.gradelimitButton=false;
          this.saveButton=false;

        }
       

        
   	      
   		  
			
		
   		}
       // this.abc.forEach(val => this.abcbk.push(Object.assign({}, val)));
    
     
		//this.createGrid();
    this.setColumnsmk();

      }

      


      onNewColumnsLoadedEvent(event){

       
      }
  
      setColumnsmk() {
        

           this.columnDefsmk =[];

         

                  {
                    let definition: ColDef;
                    definition = { headerName: "Roll Number",  field :'rollNumber' , width: 100,editable:false };
                    this.columnDefsmk.push(definition);
                    definition = { headerName: "Student Name",  field :'studentName' , width: 250,editable:false};
                    this.columnDefsmk.push(definition);
                  }



            this.componentAC.forEach((column: any) => {
            
          
            let definition: ColDef = { headerName: column.evaluationIdName+"/"+column.maximumMarks, field: column.evaluationId, width: 100 };
       
           definition.cellRendererFramework=NumeriCellRendererComponent; 
           definition.cellRendererParams = {
           values: column.maximumMarks};
           definition.valueSetter=this.hasValuesetter;
           definition.editable=true;
        
            this.columnDefsmk.push(definition);
          });
      
         {
          let definition: ColDef;
          definition = { headerName: "TotalMarks", field:'totalMarks' , width: 100,editable:false };
          this.columnDefsmk.push(definition);
          definition = { headerName: "Grades", field:'grade',  width: 100,editable:false };
          this.columnDefsmk.push(definition);

         }
   
         
        }
        httpStatus(){
          let obj = {xmltojs:'Y',
          method:'None' };   
          obj.method='/awardsheet/getStatus.htm';
        
          let sub=this.userservice.getdata(this.awardsheet_params,obj).subscribe(res=>{
          //this.userservice.log(" in switch detail selected");
          res = JSON.parse(res);
          this.resultHandlerStatus(res);
          sub.unsubscribe();
        
          })

        }

        resultHandlerStatus(res){
          this.sheetstatus=res.root.exception[0].exceptionstring;
        console.log(this.sheetstatus);
        //   switch (status){
          
        //   case "SUB":{
        //      this.submitForApprovalButton=false;
        //      this.saveButton=false;
        //      this.gradelimitButton=false ;
        //      break;

        //   }
        //   case "APR" :{
        //     this.submitForApprovalButton=false;
        //     this.saveButton=false;
        //     this.gradelimitButton=false ;
        //     break;

        //  }
        //  default:  {
        //     this.submitForApprovalButton=true;
        //     this.saveButton=true;
        //     //this.gradelimitButton=true ;
           
        //     break;

        //         }

        //       }

        }


        hasValuesetter=function(params:ValueSetterParams):boolean{

        
          let maxmarks:number;
         
         if( isNaN(Number(params.colDef.cellRendererParams.values[0])) ){
          this.userservice.log(params.column.getColId()+":Component Max marks invalid")
          return false;

         }else{
          maxmarks=params.colDef.cellRendererParams.values[0];
         }
          
      
          let id =params.column.getColId();

          if ((params.newValue !== undefined && params.newValue !== null)) 
          
          
          {
                  if(params.newValue!=="A"){   
                       if(!(isNaN(Number(params.newValue)))){  // check if number is typed

                          if( Number(params.newValue) <= maxmarks ){
                              params.data[id]=params.newValue;
                              return true;

                        }else{
                          return false;

                        }
                        
                       

                       }else{                    // if number is not entered
                        return false;
                       }


                  }else{
                    params.data[id]=params.newValue; // if value typed is A
                    return true;
                  }


                }else{   // if value is undefined or null
                  return false;
                }
       
        
         

        }
        ngOndestroy() {
         this.elementRef.nativeElement.remove();
        }

defaultColumnDefs(){
if(this.isCheck){
this.gridOptionsmk.defaultColDef={
  width:100,
  editable: function(params) {
              return (
             true
              );
            },
}
}else{
   this.gridOptionsmk.defaultColDef={
  width:100,
  editable: function(params) {
              return (
             false
              );
            },
}
}

}


    

  setColumns(columns: string[]) {
    this.columnDefs = [];
    columns.forEach((column: string) => {

       let definition: ColDef = { headerName: column, field: column, width: 120 };
       if (column === 'courseCode' ) {
         definition.checkboxSelection=true;
         
     
       } else if (column ==='Seq_No') {
        definition.valueGetter=this.hashValueGetter;
        definition.maxWidth=50;
        definition.headerName="Seq_No";

    
       }
      this.columnDefs.push(definition);
    });


    
  }

   saveMarks(triggerEvent:string){
		this.trigger=triggerEvent;
  
  let payload:string="";
  

  let markchg="";
for (var obj of this.abc){
 
  
this.componentAC.forEach(item=>{ 
  
  if(obj.rowchanged==="C"){
    if(obj[item.evaluationId]!=="Z"){
      markchg="C"
    }else{
      markchg="N"
    }
  }else{
    markchg="N"
  }


  payload+= 
  obj["rollNumber"]+"|"+item.evaluationId +"|"+ item.idType + 
  "|"+obj[item.evaluationId]+"|"+obj["totalInternal"]+"|"+"X"+"|"+"Z"+"|"+markchg+";";
  
  });
 
}

this.awardsheet_params=this.awardsheet_params.set("data",payload);
 	this.httpSaveSheet();
  
	}
  
  
  httpSaveSheet(){
    let obj = {xmltojs:'Y',
    method:'None' };   
  obj.method='/awardsheet/saveStudentMarks.htm';
  
  this.userservice.postdata(this.awardsheet_params,obj).subscribe(res=>{
    //this.userservice.log(" in switch detail selected");
    res = JSON.parse(res);
    this.resultHandlerSave(res);
  
})
    
  

   
  }


  httpSavecell(){
    let obj = {xmltojs:'Y',
    method:'None' };   
  obj.method='/awardsheet/saveStudentMarks.htm';
  
  this.userservice.postdata(this.awardsheet_params,obj).subscribe(res=>{
    //this.userservice.log(" in switch detail selected");
  //res = JSON.parse(res);
   // this.resultHandlerSave(res);
  
})
    
  

   
  }


  resultHandlerSave(result){
   
		
		if(result.root.sessionConfirm == true){
       // Alert.show(commonFunction.getMessages('sessionInactive'),commonFunction.getMessages('error'), 4, null,null,errorIcon);
        this.userservice.log("Session In active");
        this.elementRef.nativeElement.remove();
    	
    	}
		
		if(result.root.exception.exceptionstring == 'E'){
       //	Alert.show(commonFunction.getMessages('error'),commonFunction.getMessages('error'),4,null,null,errorIcon);
       this.userservice.log("Error ");
       this.elementRef.nativeElement.remove();
		}
		else{
		//	Alert.show(trigger);
			if(this.trigger=="button"){
			
         //Alert.show(commonFunction.getMessages('savedSuccessfully') ,commonFunction.getMessages('success'),4,null,null,successIcon);
         this.userservice.log("Marks Saved Successfully");
			}
			this.getStudentMarks();

		
		//awardSheetCanvas.removeChild(lab:Label);
	
	   	}
	   	//Mask.close();

  }
  oncellValueChanged(event:CellChangedEvent){
   
   
  let colid = event.column.getColId();
  let rowid =event.node.rowIndex;
  let row=this.abc[rowid];
  let prvmarks=event.oldValue;


   let newArr = this.componentAC.filter((item)=>{
     return (item.evaluationId ===colid)  });   
    
    let idtype=newArr[0].idType;


let payload= 
  row["rollNumber"]+"|"+colid +"|"+ idtype + 
  "|"+row[colid]+"|"+row["totalInternal"]+"|"+"X"+"|"+prvmarks+"|"+"C"+";";
  
  
this.awardsheet_params=this.awardsheet_params.set("data",payload);
 	this.httpSavecell();



  }
 
  onClickentergradelimit(){

    if(this.displayType==="I"){
	
      var params:Object =new Object();
      
      this.getCourseAuthorityDetails();
         }else{
           this.onClickgradelimit(); 
         }
         
  }

  getCourseAuthorityDetails(){
    let obj = {xmltojs:'Y',
    method:'None' };   
  obj.method='/awardsheet/getCourseAuthorityDetails.htm'
  ;
  
  this.userservice.getdata(this.awardsheet_params,obj).subscribe(res=>{
    //this.userservice.log(" in switch detail selected");
    res = JSON.parse(res);
    this.httpGetgetCourseAuthorityDetails(res);
  
})

   
  }
  httpGetgetCourseAuthorityDetails(res){
    //var gradeAuthorityXML = event.result as XML;
    var arrayCollect:any=[];
    var creator:String="";
    var employee:String="";
    
    
    
  //	Alert.show(gradeAuthorityXML);
    for (let obj of res.root){
      arrayCollect.push({creatorId:obj["creatorId"],emploee_id:obj["employeeId"],
      employee_name:this.awardsheet_params.get("employeeName")});
    }
    if(arrayCollect.length==0){
    //  getInstructorCountForCourse.send(params);
  //   }else if(arrayCollect.length>0){		
  //     for each(var obj:Object in gradeAuthorityXML.root){
  // //			Alert.show(obj.creatorId+"|"+obj.employeeId);
  //       creator=obj.creatorId;
  //       employee=obj.employeeId;
  //     if(creator==employee){
  //       allowEdit="Y";
  //       getCourseMarks.send(params);
  //     }else{
  //       allowEdit="N";
  //       getCourseMarks.send(params);			
  //       Alert.show( obj.employeeName +" has authority to enter grades for "+courseCode+" for "+
  //         semesterStartDate+" / "+semesterEndDate);
  //     }
  //     break;
  //     }
      
    }
  //	else{
  //		Alert.show("You donot have authority to enter Grades");
  //	}
    
    
  

  }
  onClickgradelimit(){
    console.log("hello");
  }

}    // end of class 
    
