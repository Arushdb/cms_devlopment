import { HttpParams } from '@angular/common/http';
import {  Component, ComponentFactoryResolver, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild, ɵConsole } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute, NavigationEnd, Router, UrlSegment } from '@angular/router';
import { CellEditingStoppedEvent, CellFocusedEvent, CellMouseOutEvent, ColDef, ColDefUtil, ColGroupDef, GridOptions, GridReadyEvent, RowDoubleClickedEvent, StartEditingCellParams, ValueSetterParams } from 'ag-grid-community';
import { UserService } from 'src/app/services/user.service';
import {Location} from '@angular/common';


import { isUndefined } from 'typescript-collections/dist/lib/util';

//import { NumeriCellRendererComponent } from '../numeri-cell-renderer/numeri-cell-renderer.component';
import { NumeriCellRendererComponent } from '../../shared/numeri-cell-renderer/numeri-cell-renderer.component';
import { CellChangedEvent } from 'ag-grid-community/dist/lib/entities/rowNode';

import { GriddialogComponent } from 'src/app/shared/griddialog/griddialog.component';

import {alertComponent} from    'src/app/shared/alert/alert.component'

import { SubscriptionContainer } from 'src/app/shared/subscription-container';
import { AgGridAngular } from 'ag-grid-angular';





@Component({
  selector: 'app-award-blank-sheet',
  templateUrl: './award-blank-sheet.component.html',
  styleUrls: ['./award-blank-sheet.component.css']
})

       
export class AwardBlankSheetComponent implements OnInit, OnDestroy {
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
    public saveButton:boolean=false;
    gradelimitButton:boolean=false;
    instructorCount:string="" ;
  
    private gradeauthorityholder:boolean=false;
    submitstatusofotherteacher="";

 
 
  studentmarks=[];
  editing = false;

  //columnDefsmk:ColDef[]=[];  
 
  componentAC:any[];
  columnDefs: ColDef[]; 
  studentXml:any[]=[];
  public columnDefsmk : ColDef[]=[];                             
                            
  urlPrefix:any;
  param = new HttpParams()
  .set('application','CMS');

  displayType:any;
  awardsheet_params:HttpParams=new HttpParams();
  gridOptions: GridOptions;
  gridOptionsmk: GridOptions;
  isEdit=false;
 
 
  public defaultColDef;
  
  LoggedInUser: string;
  public courseListGrid=[];
  gradelimitdetail: boolean;
  courseapprstatus: boolean;
  
  style: { width: string; height: string; flex: string; };
  displaymkgrid: boolean=false;
  
  gradelimitarraycoll: any[];
  gradelimit: string;
  employeeCode: any;
  sheetstatus: string;
  editgrid: boolean=true;
  allowEdit: string;
  marksEndSemester: any;
  totalMarks: any;
  subjectTotalMarks: any;
  styleCourse: { width: string; height: string; flex: string; };

  
  styleMarks={
    width: '100%',
    height: '100%',
    flex: '1 1 auto'

  }
  subs = new SubscriptionContainer();
  spinnerstatus: boolean=false;
  gradesCalculated: boolean;
  someoneElseHasAuthority: boolean=false;
  authorityHolderId: string;
  canSubmit: boolean;
  courseType: any;
  
  constructor(
    private router:Router,
    private userservice:UserService,
    private _Activatedroute:ActivatedRoute,
    private elementRef:ElementRef,
   
    private location:Location,
    public dialog: MatDialog,
    private renderer:Renderer2,

    ) {
      
      
     // subscribe to the router events - storing the subscription so
   // we can unsubscribe later. 
          this.subs.add =this.router.events.subscribe((evt) => {
            if (evt instanceof NavigationEnd) {
           //   console.log(evt);
              // this.gridOptionsmk.api.destroy();
              // this.gridOptions.api.destroy();
              this.displaymkgrid=false;
              this.courseListGrid=[];
              this.ngOnInit();

              
            }
        });

        


      this.gridOptions = <GridOptions>{
       // enableSorting: true,
       // enableFilter: true               
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

    this.styleCourse={
      width: '100%',
      height: '30%',
      flex: '1 1 auto'

    }

    

      const columns = ['Seq_No','courseCode', 'courseName', 'entityName','programName','branchName','specializationName','semesterStartDate'];
      this.setColumns(columns);
      

  }
  ngOnDestroy(): void {
    this.subs.dispose();
    this.elementRef.nativeElement.remove();
   
  }

  goBack(): void {
    this.location.back();
  }

  ngOnInit(): void {

    

  
     this.gridOptions.columnDefs=this.columnDefs;

     this.moduleCreationCompleteHandler();
  
  }

  

  hashValueGetter = function (params) {
  
    return params.node.rowIndex+1;
  };
  
  moduleCreationCompleteHandler():void{

    this.subs.add=this._Activatedroute.data.subscribe(data => { 
      this.spinnerstatus=false;
    this.displayType = data.displayType;
    this.courseType = data.courseType;

    this.urlPrefix="/awardsheet/"; 
    this.param=this.param.set('displayType',this.displayType);
    
    if(this.courseType=="Cor"){
      this.employeeCoreService(this.param);

    }else{
      this.employeeCourseHttpService(this.param);
    }
    
  
});
		

		
	
  }

 
  
  employeeCourseHttpService(param){
    let obj = {xmltojs:'Y',
    method:'None' };   
  obj.method='/awardsheet/getCourseList.htm';
  this.spinnerstatus=true;
  console.log("getCourseList outer",this.spinnerstatus);
  this.subs.add=this.userservice.getdata(param,obj).subscribe(res=>{
    //this.userservice.log(" in switch detail selected");

    console.log("getCourseList inner",this.spinnerstatus);
    res = JSON.parse(res);
    this.employeeCourseHttpServiceResultHandler(res);

  
   
})
  }
  employeeCoreService(param){
    let obj = {xmltojs:'Y',
    method:'None' };   
  obj.method='/corecourseawardsheet/getCourseList.htm';
  this.spinnerstatus=true;
  
  this.subs.add=this.userservice.getdata(param,obj).subscribe(res=>{
    //this.userservice.log(" in switch detail selected");

    console.log("getCourseList inner",this.spinnerstatus);
    res = JSON.parse(res);
    this.employeeCoreServiceResultHandler(res);

  
   
})
  }
  employeeCoreServiceResultHandler(res){
    console.log(res);
    this.employeeCourseHttpServiceResultHandler(res);

  }


  httpEmployeeCode(param){
    let obj = {xmltojs:'Y',
    method:'None' };   
  
  obj.method='/awardsheet/getEmployeeCode.htm';
  
  this.subs.add=this.userservice.getdata(param,obj).subscribe(res=>{

    console.log("In employee codespinner status:",this.spinnerstatus);
    //this.userservice.log(" in switch detail selected");
    res = JSON.parse(res);
    this.resultHandlerEmployeeCode(res);
    
  
})
   

    
  }
  resultHandlerEmployeeCode(res){
    console.log(res);
  }

   employeeCourseHttpServiceResultHandler(res){

   
    if (isUndefined(res.CodeList.root)){
      this.setoffButton();
      this.userservice.log("No Subject Assigned");
      //this.goBack();

      return;

    }
    this.setoffButton();
   

    let employeeCourse =res;
  

    
		
    //var param:Object =new Object();
    this.awardsheet_params = this.awardsheet_params.set("time",new Date().toString())
	 
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
      
     
		}
	}
	
  

  OngridReady(parameters:GridReadyEvent){

  
   
      //this.defaultColumnDefs();
          this.style = {
            width: '100%',
            height: '100%',
            flex: '1 1 auto'
        };

   //     this.gridOptionsmk.api.sizeColumnsToFit();
    
  // this.gridOptionsmk.api.setDomLayout('autoHeight');
   this.gridOptionsmk.api.setAlwaysShowVerticalScroll(true);
    this.gridOptionsmk.api.setDomLayout('normal');
   

     
    this.gridOptionsmk.api.setColumnDefs(this.columnDefsmk);
    this.gridOptionsmk.api.setRowData(this.studentmarks);
   
    
   
    
    
       
  }


  OnCoursegridReady($event){
    this.styleCourse = {
      width: '100%',
      height: '30%',
      flex: '1 1 auto'
  };
  this.gridOptions.api.setRowData(this.courseListGrid);


}



  gradeHttpService(){
    let obj = {xmltojs:'Y',
    method:'None' };   
  obj.method='/awardsheet/getGrades.htm';
  
  this.subs.add=this.userservice.getdata(this.awardsheet_params,obj).subscribe(res=>{
    //this.userservice.log(" in switch detail selected");
    res = JSON.parse(res);
    this.gradeHttpServiceResultHandler(res);
    
})
    
  }

  gradeHttpServiceResultHandler(res){
		//gradeXML =  event.result as XML;
		let gradeXML = res;
			
	}
	



 getupdatedgradeForSave(callingMethod:string):void{
//	Alert.show(callingMethod);
	//this.saveCaller=callingMethod;
	var param:Object =new Object();
	var gradeobject:Object=new Object();
		this.httprequestgetupdatedgradelimitForSave() ;
	
}

httprequestgetupdatedgradelimitForSave(){
  let obj = {xmltojs:'Y',
  method:'None' };   
obj.method='/awardsheet/getgradelimit.htm';

this.subs.add=this.userservice.getdata(this.awardsheet_params,obj).subscribe(res=>{
  //this.userservice.log(" in switch detail selected");
  res = JSON.parse(res);
  this.getupdatedgradelimitForSaveResultHandler(res);
});
}

getupdatedgradelimitForSaveResultHandler(res){

  
  
  this.gradelimitarraycoll=[];
  if(isUndefined(res.CodeList.root)){
    this.gradelimitarraycoll=[];
  }
  else
  {
        this.gradelimitarraycoll=[];
        for (var obj of  res.CodeList.root){
          this.gradelimitarraycoll.push({coursecode:obj.courseCode,grades:obj.grades ,marksfrom:obj.marksfrom,marksto:obj.marksto});	
        }
  }
  
	if (this.gradelimitarraycoll.length== 0){
		//Alert.show(commonFunction.getMessages('gradeLimitNotExist'),commonFunction.getMessages("info"),4,null,null,infoIcon) ;
		this.gradelimitdetail = false ;
		
	}else{
		this.gradelimitdetail = true ;
	}
	
	//this.saveMarks(this.saveCaller);
}

oncellFocused(event:CellFocusedEvent){
  //this.saveButton=false;
  let params: StartEditingCellParams
  
  
  if(!(event.column===null)){
   
     params={rowIndex:event.rowIndex,colKey:event.column.getColId()};
    this.gridOptionsmk.api.startEditingCell(params);


  }
 

}



oncellEditingStopped(event:CellEditingStoppedEvent){
  this.saveButton=true;
  console.log("editing stopped",event);
}


onRowSelected(event){

  this.userservice.clear();
 
  if(this.gridOptions.api.getSelectedNodes().length>1){
    this.userservice.log("Please select only One");
    this.gridOptions.api.deselectAll();
    this.setoffButton();
    return;
  }
        
  if(event.node.selected){
   
   
    this.setoffButton();
    this.spinnerstatus=true;
    this.displaymkgrid=true;
    this.columnDefsmk =[]; 
    this.componentAC=[];

   this.furtherExecution(event);
  
   

  }else{
   
    this.spinnerstatus=false;
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
    this.awardsheet_params=this.awardsheet_params.set("sessionStart",event.data.startDate);
    this.awardsheet_params=this.awardsheet_params.set("sessionStartDate",event.data.startDate);
    this.awardsheet_params=this.awardsheet_params.set("sessionEndDate",event.data.endDate);
    this.awardsheet_params=this.awardsheet_params.set("sessionenddt",event.data.endDate);
    this.awardsheet_params=this.awardsheet_params.set("sessionEnd",event.data.endDate);
    this.awardsheet_params=this.awardsheet_params.set("semesterstartdt",event.data.semesterStartDate);
    this.awardsheet_params=this.awardsheet_params.set("semesterStartDate",event.data.semesterStartDate);
    this.awardsheet_params=this.awardsheet_params.set("semesterenddt",event.data.semesterEndDate);
    this.awardsheet_params=this.awardsheet_params.set("semesterEndDate",event.data.semesterEndDate);
    this.awardsheet_params=this.awardsheet_params.set("programId",event.data.programId);
    this.awardsheet_params=this.awardsheet_params.set("branchCode",event.data.branchId);
    this.awardsheet_params=this.awardsheet_params.set("specCode",event.data.specializationId);
    this.awardsheet_params=this.awardsheet_params.set("semesterCode",event.data.semesterCode);
    this.awardsheet_params=this.awardsheet_params.set("semesterName",event.data.semesterCode);
    this.awardsheet_params=this.awardsheet_params.set("startDate",event.data.semesterStartDate);
    this.awardsheet_params=this.awardsheet_params.set("endDate",event.data.semesterEndDate);
    this.awardsheet_params=this.awardsheet_params.set("employeeCode",this.employeeCode);
    this.awardsheet_params=this.awardsheet_params.set("EmployeeName",event.data.employeeName);
    this.awardsheet_params=this.awardsheet_params.set("approvalOrder","1");
    this.awardsheet_params=this.awardsheet_params.set("entityName",event.data.entityName);
    this.awardsheet_params=this.awardsheet_params.set("programName",event.data.programName);
    this.awardsheet_params=this.awardsheet_params.set("branchName",event.data.branchName);
    this.awardsheet_params=this.awardsheet_params.set("spclName",event.data.specializationName);
    this.awardsheet_params=this.awardsheet_params.set("fatherNameFlag","Y");
    this.awardsheet_params=this.awardsheet_params.set("courseName",event.data.courseName);


                //Steps
                //  1 :check  status of other sheets if multiple award sheets.:getCourseGradeLimitStatus()

                //  2 :check if grade limit is present or not   method:httprequestgetupdatedgradelimitForSave()
                //  3 :check if user has a grade limit authority method:getCourseAuthorityDetails()
                //  4 :Check award sheet submitted status before loading   this.httpStatus();  
               
                
   
          //this.getCourseGradeLimitStatus(); //check  status of other sheets .
          if(this.displayType=="I" && this.courseType=="Reg"){
            this.httprequestgetupdatedgradelimitForSave(); // check if grade limit is present or not
          this.getInstructorCountForCourse()

          }else{
              
            this.httpStatus();
          }
          
          //this.getCourseAuthorityDetails(); // check is user has  grade limit authority

           											
	}
  
  
  
      getEvaluationComponents(){
  
  
          let obj = {xmltojs:'Y',
          method:'None' };   
        obj.method='/awardsheet/getEvaluationComponents.htm';
        
        this.subs.add=this.userservice.getdata(this.awardsheet_params,obj).subscribe(res=>{
          //this.userservice.log(" in switch detail selected");
          res = JSON.parse(res);
          this.resultHandlerComponent(res);
        
      })
  
         
  
      }

      getcoreEvaluationComponents(){
  
  
        let obj = {xmltojs:'Y',
        method:'None' };   
      obj.method='/corecourseawardsheet/getEvaluationComponents.htm';
      
      this.subs.add=this.userservice.getdata(this.awardsheet_params,obj).subscribe(res=>{
        //this.userservice.log(" in switch detail selected");
        res = JSON.parse(res);
        this.resultHandlerComponent(res);
      
    })

       

    }
  
      resultHandlerComponent(res){
  
  
          this.componentAC = [];
         let  flag:Boolean=true;
         if(!(isUndefined(res.ComponentList.component)))
          {
               
         
       
              for (let object of res.ComponentList.component){
                  this.componentAC.push({evaluationId:object.evaluationId,evaluationIdName:object.evaluationIdName,group:object.group,
                  rule:object.rule,idType:object.idType,displayType:object.displayType,maximumMarks:object.maximumMarks,componentType:object.componentType});
              }
          }else{
            this.userservice.log("Subject components are not set up ");
            this.setoffButton()
            return;
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
      
      this.subs.add=this.userservice.getdata(this.awardsheet_params,obj).subscribe(res=>{
        //this.userservice.log(" in switch detail selected");
        res = JSON.parse(res);
        this.resultHandlerStudent(res);
      
    })

      }
      resultHandlerStudent(res){

     
      if(isUndefined(res.StudentList.student)){
        this.userservice.log("No Student found");
        this.setoffButton();
        
        return;
      }

        this.studentXml=[];
     
        this.studentXml=res.StudentList.student;

    		
	  	this.getStudentMarks();
      

      }

      setoffButton(){
      
        this.submitForApprovalButton=false;
        this.gradelimitButton=false;
        this.editgrid=false;
        this.saveButton=false;
        this.spinnerstatus=false;
      }

      getStudentMarks(){
        this.spinnerstatus=true;
        //this.displaymkgrid =false;
        this.httpStudentMarksList();

      }

      calculateClasstotal(mode?:string){
      
        this.spinnerstatus=true;
        let obj = {xmltojs:'Y',
        method:'None' };   
        obj.method='/awardsheet/calculateClasstotal.htm';
      
        this.subs.add=this.userservice.getdata(this.awardsheet_params,obj).subscribe(res=>{
        //this.userservice.log(" in switch detail selected");
        res = JSON.parse(res);
        if(mode=="getmarks")
        this.getStudentMarks();

        if(mode=="submitsheet")
        this.submitSheet();
      
        
       
        
      
    },error=>{

      this.userservice.log("There is some issue at server ,Please try again");
      this.spinnerstatus=false;
    }
    )
      }
      



      httpStudentMarksList(){
        let obj = {xmltojs:'Y',
        method:'None' };   
        obj.method='/awardsheet/getStudentMarks.htm';
      
        this.subs.add=this.userservice.getdata(this.awardsheet_params,obj).subscribe(res=>{
        //this.userservice.log(" in switch detail selected");
        res = JSON.parse(res);
        this.resultHandlerStudentMarks(res);
        
      
    })
        
        
      }
      resultHandlerStudentMarks(res)
      {
    
        this.studentmarks=[];

                      this.submitForApprovalButton=false;
                      this.gradelimitButton=true;
                      this.editgrid=true;
                      this.saveButton=true;

                      let marksEntered =true;

        
  
		this.gradesCalculated=true;
        
       for  (var obj1 of  this.studentXml)
       {
  
                let resultObj:Object=new Object();
              
                resultObj["rollNumber"]=String(obj1.rollNumber).toString();
                            
                resultObj["studentName"]=obj1.studentName;
                resultObj["totalMarks"]="0";
                resultObj["grade"]="";

           
                for (var obj of this.componentAC)
                {
                
                resultObj[obj.evaluationId]="Z";
                }
      

                if(isUndefined(res.MarksList.marks))
                {  
                        this.submitForApprovalButton=false;
                       
                          this.submitForApprovalButton=false ;
                          this.gradesCalculated=false;
                          marksEntered=false;

                }
                else
                {

                       for (var obj2 of  res.MarksList.marks)
                       {

                          if(String(obj1.rollNumber).toString()===String(obj2.rollNumber).toString())
                          {
                            
                                    if(String(obj2.marks).toString()!=="" )
                                        resultObj[obj2.evaluationId]=obj2.marks;
                                      
                                    else
                                    {
                                        resultObj[obj2.evaluationId]="Z";
                                        this.submitForApprovalButton=false;
                                        this.gradesCalculated=false;
                                        marksEntered=false;
                                    }

                                    if(String(obj2.attendence).toString()=== "ABS" )
                                      resultObj[obj2.evaluationId]="A";
                    
                                    if(this.displayType.toString()==="I"  )
                                    { 
                                      resultObj["grade"]=obj2.internalGrade;
                                      resultObj["totalMarks"]=obj2.totalInternal;	
                                      resultObj["totalInternal"]=obj2.totalInternal;	
                                                    
                                    }

                                    if(this.displayType.toString()==="E")
                                    { 
                                      resultObj["grade"]=obj2.externalGrade;
                                      resultObj["totalMarks"]=obj2.totalExternal;	
                                      resultObj["totalExternal"]=obj2.totalExternal;	
                                        
                                    }

                                    if(this.displayType.toString()==="R")
                                    { 
                                      resultObj["grade"]=obj2.internalGrade;
                                      resultObj["totalMarks"]=obj2.totalInternal;	
                                      resultObj["totalInternal"]=obj2.totalInternal;	
                                      
                                    }
                                    

                                   
                                    if(
                                      
                                      (String(resultObj["grade"]).toString().trim()==="") ||
                                      (String(resultObj["grade"]).toString()==="X")
                                    )
                                    {
                                      this.submitForApprovalButton=false ;
                                      this.gradesCalculated=false;
                                    }
                
                          }else{      // no marks record present in Student Marks
                                      
                          }      
   					
                        }
                  }
       
      
   		
                      this.studentmarks.push(resultObj);
                  // check if any evaluation ID is left with Z value
                      for (let obj of this.componentAC)
                      {
                      if(resultObj[obj.evaluationId]==="Z"){
                        this.submitForApprovalButton=false;
                        marksEntered=false;

                      }
                        
                      }
                      


        }
            

      

        
        /// set up buttons now
              if(this.columnDefsmk.length>0)
              this.gridOptionsmk.api.setRowData(this.studentmarks);

              if(this.sheetstatus==="APR" ||this.sheetstatus==="SUB")
              {
                this.submitForApprovalButton=false;
                this.gradelimitButton=false;
                this.saveButton=false;
                this.editgrid =false;
                
              }
              else
              {
                     // step-0 -A if display type is External or remedial

                     if (this.displayType=="E"||this.displayType=="R"){

                     
                        this.submitForApprovalButton=false;

                        if(this.gradesCalculated && marksEntered){
                          this.submitForApprovalButton=true;
                        }
                    }
                // step-0 -B if display type is Internal and it is a core course
                if (this.displayType=="I"&& this.courseType=="Cor"){
                  this.submitForApprovalButton=false;

                  if(marksEntered){
                    this.submitForApprovalButton=true;
                  }


                }


                //step-1  for Internal award sheet only
                //   if single teacher  and grades are calculated  and authority holder  submit button should be on
                    if(String(this.instructorCount).toString()==="1" && this.gradesCalculated && this.gradeauthorityholder
                    && marksEntered && this.displayType=="I" && this.courseType=="Reg")
                    {
                      this.submitForApprovalButton=true;
                      console.log("Step-1");

                    }
   

                    //step-2   for Internal award sheet only
                //if multi teacher  and   authority holder  and  grades calculated 
                // and all other teacher submitted   submit button should  be on

                    if(String(this.instructorCount).toString()!=="1" && this.gradesCalculated
                    && this.submitstatusofotherteacher==="Y"
                    && this.gradeauthorityholder
                    && marksEntered
                    && this.displayType=="I"
                    && this.courseType=="Reg")
                    
                      {
                      this.submitForApprovalButton=true;
                      console.log("Step-2");
                      }
                //step-3       for Internal award sheet only
                //if multi teacher  and  not a authority holder   
                // and some one else has a authority  and authority holder is not assigned its sheet ,submit button should  be on
                    if(String(this.instructorCount).toString()!=="1" 
                        && !this.gradeauthorityholder
                        //&& this.gradelimitdetail
                        && this.someoneElseHasAuthority
                        //&& this.submitstatusofotherteacher==="N"
                        && marksEntered 
                        && this.canSubmit
                        && this.displayType=="I"
                        && this.courseType=="Reg"
                        
                        )
                                                    
                    
                        {
                          this.submitForApprovalButton=true;
                          console.log("Step-3");
                          
                        }

                
                

              }
              console.log("Sheet status:",this.sheetstatus,"instructor count:",this.instructorCount
              ,"this.gradesCalculated:",this.gradesCalculated,"submitstatusofotherteacher",this.submitstatusofotherteacher
              , "this.gradeauthorityholder",this.gradeauthorityholder,"allowEdit:",this.allowEdit
              ,"this.gradelimitdetail",this.gradelimitdetail,"editgrid",this.editgrid,"someoneElseHasAuthority:",
              this.someoneElseHasAuthority,"marksEntered:",marksEntered,"canSubmit:", this.canSubmit);
      
   
		          if(this.courseType=="Reg")
              this.setNewColumnsmk();
              else
              this.setcoreColumnsmk();
              this.spinnerstatus=false;

      }

      
     

     
  
      setColumnsmk()
       {
        
                 {
                    let definition: ColDef;
                    
                    definition = { headerName: "Roll Number",  field :'rollNumber' , width: 100,editable:false };
                    this.columnDefsmk.push(definition);
                    definition = { headerName: "Student Name",  field :'studentName' , width: 200,editable:false};
                    this.columnDefsmk.push(definition);
                  }

         

                  this.componentAC.forEach((column: any) => 
                  {
          
                      let definition: ColDef = 
                      { headerName: column.evaluationIdName+"/"+column.maximumMarks+"/"+column.group, field: column.evaluationId, width: 125 };
                
                    definition.cellRendererFramework=NumeriCellRendererComponent; 
                    definition.cellRendererParams = {
                    values: column.maximumMarks};
                    definition.valueSetter=this.hasValuesetter;
                    definition.editable=this.editgrid;
                    
                              
                    definition.suppressNavigable=!this.editgrid;
                  
                      this.columnDefsmk.push(definition);
                    }
                  );
      
         
         
                  {
                  let definition: ColDef;
                  definition = { headerName: "TOT", field:'totalMarks' , width: 80,editable:false };
                  this.columnDefsmk.push(definition);
                  definition = { headerName: "GD", field:'grade',  width: 80,editable:false };
                  this.columnDefsmk.push(definition);

                  }
   
         
        }

        setNewColumnsmk() {
              {
          let groupdef:ColGroupDef;
          let columndef: ColDef;
        
            groupdef={headerName:"Student", children: [
             {headerName: "RollNo",  field :'rollNumber' , width: 90,editable:false,pinned: 'left',filter:true,sortable:true},
             { headerName: "Name",  field :'studentName' , width: 150,editable:false,sortable:true,
             pinned: 'left',tooltipField:'studentName',filter:true}
           
           ]};
           this.columnDefsmk.push(groupdef);
               
              }
      
        {


          let groupdef:ColGroupDef={headerName:"",children:[],groupId:""};
         
          
          let componentGroups:any[] =this.getgroups();
         

          for(let i=0;i<componentGroups.length;i++)
          {
            
              groupdef={headerName:"",children:[],groupId:""};

              groupdef.headerName=componentGroups[i].group ;
              
             
                           
              let grpChildren=this.getGroupChildren(componentGroups[i].group);
              
              groupdef.children=grpChildren;
              groupdef.groupId=componentGroups[i].group;
              //groupdef.headerClass='ag-header-group-cell';
              
              this.columnDefsmk.push(groupdef);
            

          }
         
       
     
        }
        {
          let definition: ColDef;
          definition = { headerName: "TOT", field:'totalMarks' , width: 80,editable:false ,pinned:"right",sortable:true};
          this.columnDefsmk.push(definition);
          definition = { headerName: "GD", field:'grade',  width: 80,editable:false,pinned:"right" };
          this.columnDefsmk.push(definition);

          }

      
    
     
      
     }

     setcoreColumnsmk() {
      {
      let groupdef:ColGroupDef;
      let columndef: ColDef;

    groupdef={headerName:"Student", children: [
     {headerName: "RollNo",  field :'rollNumber' , width: 90,editable:false,pinned: 'left',filter:true,sortable:true},
     { headerName: "Name",  field :'studentName' , width: 150,editable:false,pinned: 'left',tooltipField:'studentName',filter:true}

       
   ]};
   this.columnDefsmk.push(groupdef);
       
      }

{


  let groupdef:ColGroupDef={headerName:"",children:[],groupId:""};
 
  
  let componentGroups:any[] =this.getgroups();
 
  let grpChildren:any;
  for(let i=0;i<componentGroups.length;i++)
  {
    
      groupdef={headerName:"",children:[],groupId:""};

      groupdef.headerName=componentGroups[i].group ;
      
     
         grpChildren=this.getCoreGroupChildren(componentGroups[i].group);

      
                   
      
      
      groupdef.children=grpChildren;
      groupdef.groupId=componentGroups[i].group;
      //groupdef.headerClass='ag-header-group-cell';
      
      this.columnDefsmk.push(groupdef);
    

  }
 


}
{
  let definition: ColDef;
  definition = { headerName: "TOT", field:'totalMarks' , width: 80,editable:false ,pinned:"right",sortable:true};
  this.columnDefsmk.push(definition);
  
  }





}
        getgroups():any[]
        {
                let start=1;
                let grpary:any[]=[];
                let obj ={group:"",marks:""}
                let grparyobj:typeof obj[]=[];

                let group="";

               
            

                for(let i=0;i<this.componentAC.length;i++)
                {
                      
                      if(this.componentAC.length===1){
                        group= this.componentAC[i].group;
                        obj.group=group;
                        obj.marks= this.componentAC[i].maximumMarks;
                        grparyobj.push(obj);
                        break;


                      }

                      if(start===1){

                        group= this.componentAC[i].group;  
                       
                                                                               
                        start++;

                      }
                  
                     if(String(group).toString()===String(this.componentAC[i].group).toString())
                        {
                          continue;
                        }else{
                          obj = Object.create(obj);
                          obj.group=group;
                          obj.marks= this.componentAC[i].maximumMarks;
                          
                          grparyobj.push(obj);
                          group= this.componentAC[i].group; 

                        }

                    if(i===this.componentAC.length-1)
                    {
                      obj = Object.create(obj);
                      
                      obj.group=this.componentAC[i].group;
                      obj.marks=String(Number(this.componentAC[i].maximumMarks));
                      grparyobj.push(obj);
                      
                    }

                  
                }

          return grparyobj;
        }
        getGroupChildren(group):any[]
        {
                let columndef: ColDef={};
                let children:any[]=[];
               
              
                this.componentAC.forEach(column=>
                  {
                        
                      if(String(column.group).toString()===String(group).toString())
                      {
                          columndef={};
                          //columndef.headerName=column.evaluationIdName+"/"+column.maximumMarks;
                          columndef.headerName=column.evaluationIdName;
                          columndef.headerTooltip="Max Marks:"+column.maximumMarks;
                          columndef.field=column.evaluationId;
                          columndef.width=80;
                          columndef.tooltipValueGetter= this.tooltipgetter;

                          columndef.cellRendererFramework=NumeriCellRendererComponent; 
                          columndef.cellRendererParams = {
                          values: column.maximumMarks};
                          columndef.valueSetter=this.hasValuesetter;
                          columndef.editable=this.editgrid;
                          columndef.suppressNavigable=!this.editgrid;
                          children.push(columndef);

                      }

                  });
                 
          return children;
        }
        getCoreGroupChildren(group):any[]
        {
                let columndef: ColDef={};
                let children:any[]=[];
               
              
                this.componentAC.forEach(column=>
                  {
                        
                      if(String(column.group).toString()===String(group).toString())
                      {
                          columndef={};
                          //columndef.headerName=column.evaluationIdName+"/"+column.maximumMarks;
                          columndef.headerName=column.evaluationIdName;
                          columndef.headerTooltip="Max Marks:"+column.maximumMarks;
                          columndef.field=column.evaluationId;
                          columndef.width=80;
                          columndef.tooltipValueGetter= this.tooltipgetter;

                          columndef.cellRendererFramework=NumeriCellRendererComponent; 
                          columndef.cellRendererParams = {
                          values: column.maximumMarks};
                          columndef.valueSetter=this.hasValuesetter;
                        
                          if(column.componentType=="1"){
                            columndef.editable=this.editgrid;

                          }else{
                            columndef.editable=false;

                          }
                          
                          columndef.suppressNavigable=!this.editgrid;
                          children.push(columndef);

                      }

                  });
                 
          return children;
        }


        tooltipgetter =function (params):string {
        return " 1) Press ENTER key after input of Marks  2) Use A to Mark Absent" }
        httpStatus(){
          let obj = {xmltojs:'Y',
          method:'None' };   
          obj.method='/awardsheet/getStatus.htm';
        
          this.subs.add=this.userservice.getdata(this.awardsheet_params,obj).subscribe(res=>{
          //this.userservice.log(" in switch detail selected");
          res = JSON.parse(res);
          this.resultHandlerStatus(res);
         
        
          })

        }

        resultHandlerStatus(res){
       


          this.sheetstatus=String(res.root.exception[0].exceptionstring).toString();
          

          if(this.courseType=="Reg")
          this.getEvaluationComponents();
          else
          this.getcoreEvaluationComponents();
         
       
     

        }


        hasValuesetter=function(params:ValueSetterParams):boolean{

        
          let maxmarks:number;
         
         if( isNaN(Number(params.colDef.cellRendererParams.values[0])) ){
          this.userservice.log(params.column.getColId()+":Component Max marks invalid");
          
          return false;

         }else{
          maxmarks=params.colDef.cellRendererParams.values[0];
         }
          
      
          let id =params.column.getColId();

          if ((params.newValue !== undefined && params.newValue !== null && String(params.newValue).trim() !=="")) 
          
          
          {
                  if(params.newValue!=="A"){   
                       if(!(isNaN(Number(params.newValue)))){  // check if number is typed

                          if( Number(params.newValue) <= maxmarks ){
                              params.data[id]=params.newValue;
                              return true;

                        }else{
                          
                          //this.userservice.log("Number enetered is not valid");
                          params.data[id]="Invalid";
                          return false;

                        }
                        
                       

                       }else{    
                        params.data[id]="Invalid";                // if number is not entered
                        return false;
                       }


                  }else{
                    params.data[id]=params.newValue; // if value typed is A
                    return true;
                  }


                }else{   // if value is undefined or null or blank
                  params.data[id]="Invalid";
                  return false;
                }
       
        
         

        }
       

    

  setColumns(columns: string[]) {
    this.columnDefs = [];
    columns.forEach((column: string) => {

       let definition: ColDef = { headerName: column, field: column, width: 150 };
       if (column === 'courseCode' ) {
        definition.headerName="Subject";
         definition.checkboxSelection=true;
         definition.maxWidth=120;
     
       } else if (column ==='Seq_No') {
        definition.valueGetter=this.hashValueGetter;
        definition.maxWidth=50;
       definition.headerName="Seq_No";
  
       
       } 
       else if (column ==='entityName') {
       
      
       definition.headerName="Faculty";
       definition.maxWidth=200;
  
       }
       else if (column ==='courseName') {
       
      
       definition.headerName="Name";
  
       }
       else if (column ==='programName') {
       
       
       definition.headerName="Program";
  
       }
       else if (column ==='branchName') {
       
   
       definition.headerName="Branch";
  
       }
       else if (column ==='specializationName') {
       
        
       definition.headerName="Spec";
  
       }
       else if (column ==='semesterStartDate') {
       
    
       definition.headerName="Sem_Date";
  
       }




      this.columnDefs.push(definition);
    });


    
  }

 
  httpSavecell(refreshgrid){
      let obj = {xmltojs:'Y',
      method:'None' };   
      obj.method='/awardsheet/saveStudentMarks.htm';
    
      this.subs.add=this.userservice.postdata(this.awardsheet_params,obj).subscribe(res=>{
     if (refreshgrid){
      this.getStudentMarks();
     
     
     }
    
    
      })
   
  }


 
  oncellValueChanged(event:CellChangedEvent){
   
   
  let colid = event.column.getColId();
  let rowid =event.node.rowIndex;
  let row=this.studentmarks[rowid];
  let prvmarks=event.oldValue;
  let refreshgrid=false;
  let payload:string;

  console.log("Cell value changed",event,event.newValue,event.oldValue,row[colid]);
   let newArr = this.componentAC.filter((item)=>{
     return (item.evaluationId ===colid)  });   
    
    let idtype=newArr[0].idType;


let payload1= 
  row["rollNumber"]+"|"+colid +"|"+ idtype + 
  "|"+row[colid]+"|"+row["totalInternal"]+"|"+"X"+"|"+prvmarks+"|"+"C"+";";
// let payload= 
//   row["rollNumber"]+"|"+colid +"|"+ idtype + 
//   "|"+event.newValue+"|"+row["totalInternal"]+"|"+"X"+"|"+prvmarks+"|"+"C"+";";

  // if display type internal  or remedial save marks on internal field

  if(this.displayType==="I"){
    payload= 
  row["rollNumber"]+"|"+colid +"|"+ idtype + 
  "|"+event.newValue+"|"+row["totalInternal"]+"|"+"X"+"|"+prvmarks+"|"+"C"+";";


  }
  // if display type External  save marks on internal field
  if(this.displayType==="E"){
    payload= 
  row["rollNumber"]+"|"+colid +"|"+ idtype + 
  "|"+event.newValue+"|"+row["totalExternal"]+"|"+"X"+"|"+prvmarks+"|"+"C"+";";


  }
   // if display type Remedial  save marks on total marks field
   if(this.displayType==="R"){
    payload= 
  row["rollNumber"]+"|"+colid +"|"+ idtype + 
  "|"+event.newValue+"|"+row["totalMarks"]+"|"+"X"+"|"+prvmarks+"|"+"C"+";";


  }



  if(row[colid]==event.newValue){
    
  }else{
    refreshgrid=true;
  

  }
  
  
this.awardsheet_params=this.awardsheet_params.set("data",payload);
 	this.httpSavecell(refreshgrid);



  }
 
  onClickentergradelimit(){

    if(this.displayType==="I"){
	
     // var params:Object =new Object();
      
      this.getCourseAuthorityDetails();
         }else{
           this.onClickgradelimit(); 
         }
         
  }
//  if any teacher has grade authority ==(grade limit authority table)  //
  getCourseAuthorityDetails(){
    let obj = {xmltojs:'Y',
    method:'None' };   
  obj.method='/awardsheet/getCourseAuthorityDetails.htm'
  ;
  
  this.subs.add=this.userservice.getdata(this.awardsheet_params,obj).subscribe(res=>{
    //this.userservice.log(" in switch detail selected");
    res = JSON.parse(res);
    this.httpGetgetCourseAuthorityDetails(res);   //
  
})

   
  }
  
  httpGetgetCourseAuthorityDetails(res){
  


      
 let arrayCollect:any[]=[];
           
   if(!(isUndefined(res.CodeList.root)))
        arrayCollect=res.CodeList.root;
       
  
     if(arrayCollect.length===0){  
      this.userservice.log("No one has authority to enter grades");
     
     }else{
      console.log("creatorId",arrayCollect[0].creatorId,"employeeId",arrayCollect[0].employeeId);

      this.authorityHolderId=String(arrayCollect[0].employeeId).toString();
     
         if (String(arrayCollect[0].creatorId).toString() === String(arrayCollect[0].employeeId).toString()   )
             
        
                {
                  this.gradeauthorityholder=true;
                  this.allowEdit="Y";
                  this.getCourseMarks();
                }else
                
                {
                  this.gradeauthorityholder=false;
                  this.allowEdit="N";
                  this.getCourseMarks();	
                  this.someoneElseHasAuthority =true;		
                  this.userservice.log( arrayCollect[0].employeeName +" has authority to enter grades for "+this.awardsheet_params.get("courseCode")+" for "+
                    this.awardsheet_params.get("semesterstartdt")+" / "+this.awardsheet_params.get("semesterenddt"));
           
                }
       

            } 
            this.getCourseGradeLimitStatus();
            
   }

      getCourseMarks(){
        let obj = {xmltojs:'Y',
        method:'None' };   
        obj.method='/awardsheet/getCourseMarks.htm';
      
      
        this.subs.add=this.userservice.getdata(this.awardsheet_params,obj).subscribe(res=>{
       
        res = JSON.parse(res);
      
        this.httpGetCourseMarks(res);
      
            })
    
  }

      httpGetCourseMarks(res){
   	try{
	for  (var o of res.courseDetails.Details){
		this.marksEndSemester=o.marksEndSemester;
		this.subjectTotalMarks=o.totalMarks
		break;
	}	
	}catch(e){
		this.userservice.log(e);
	}
    //openGradesPopup();
    
    
      }


      onclickgradelimitbutton(){
        const dialogConfig = new MatDialogConfig();
      dialogConfig.width="100%";
      dialogConfig.height="50%";
       dialogConfig.data={ 
      courseCode:this.awardsheet_params.get("courseCode"),
      semesterStartDate:this.awardsheet_params.get("semesterstartdt"),
      semesterEndDate:this.awardsheet_params.get("semesterenddt"),
      displayType:this.displayType,allowEdit:this.allowEdit,
      sessionStartDate:this.awardsheet_params.get("sessionstartdt"),
      sessionEndDate:this.awardsheet_params.get("sessionenddt"),
      menuType:"AwardSheet",creatorEntity:this.awardsheet_params.get("entityId"),
      creatorPCK:this.awardsheet_params.get("programCourseKey"),
      creator:this.LoggedInUser,
      
      marksEndSemester:this.marksEndSemester,
      totalMarks:this.subjectTotalMarks
        
    };

    const dialogRef=  this.dialog.open(GriddialogComponent,dialogConfig)
    
    this.subs.add=dialogRef.afterClosed().subscribe(result => {
  if(result)
 
    this.getStudentMarks();
     });      
  

      }

  getInstructorCountForCourse(){

    let obj = {xmltojs:'Y',
    method:'None' };   
  obj.method='/awardsheet/getInstructorCountForCourse.htm'
  ;
  
  this.subs.add=this.userservice.getdata(this.awardsheet_params,obj).subscribe(res=>{
    //this.userservice.log(" in switch detail selected");
    res = JSON.parse(res);
    this.httpGetInstructorCountForCourse(res);
  
})


  }
  httpGetInstructorCountForCourse(res){
    
    this.instructorCount = res.CodeList.root[0].status;
   
    try{
      
           
    if(String(this.instructorCount).toString()==='1' ){
      this.allowEdit="Y";
      this.gradeauthorityholder=true;
      this.getCourseMarks();
      this.getCourseGradeLimitStatus();
    }
       
    else{
      this.allowEdit="N";
      //this.userservice.log("You do not have authority to enter grades"); 
      this.gradeauthorityholder=false;
      this.getCourseMarks();
      
      this.getCourseAuthorityDetails();

     

      //window.alert("You do not have authority to enter grades");
    }
    }catch(e){
      window.alert(e);
        }
        
       
  }


  onClickgradelimit(){
   
  }


  submitConfirm(){
    this.gridOptionsmk.api.stopEditing();
  
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width="100%";
    dialogConfig.height="50%";

    const dialogRef=  this.dialog.open(alertComponent,
      {data:{title:"Warning",content:"Please confirm ",ok:true,cancel:true,color:"warn"},
      width:"20%",height:"20%"
      });

      this.subs.add=dialogRef.afterClosed().subscribe((result:boolean) => {
   
    if (result===true){
      this.calculateClasstotal('submitsheet');
      
    }else{

      return;
    }


    });      

      
  }



  submitSheet(){
    this.awardsheet_params=this.awardsheet_params.set("status","SUB");
    let obj = {xmltojs:'Y',
    method:'None' }; 
    this.spinnerstatus=true;  
    obj.method='/awardsheet/submitForApproval.htm';
  
  
    this.subs.add=this.userservice.getdata(this.awardsheet_params,obj).subscribe(res=>{
    //this.userservice.log(" in switch detail selected");
    res = JSON.parse(res);
   
  
    this.resultHandlerSubmit(res);
  
        })

  }

  resultHandlerSubmit(res){
    this.gridOptions.api.deselectAll();
    this.userservice.log("Sheet Submitted Successfully");
    this.setoffButton();
    return;
    
  }

  /// Check sheet status of other user ie is it submitted or not 
  getCourseGradeLimitStatus(){

    

    this.awardsheet_params=this.awardsheet_params.set("semesterStartDate", this.awardsheet_params.get('semesterstartdt'));
    this.awardsheet_params=this.awardsheet_params.set("semesterEndDate", this.awardsheet_params.get('semesterenddt'));
    
                                            

    
    let obj = {xmltojs:'Y',
    method:'None' };   
    obj.method='/coursegradelimitpercourse/getCourseGradeLimit.htm';
   
    this.userservice.getdata(this.awardsheet_params,obj).subscribe(res=>{
    //this.userservice.log(" in switch detail selected");
    res = JSON.parse(res);
    
    this.getCourseGradeLimitSuccess(res)
  
        })

  }
  getCourseGradeLimitSuccess(res)
  {

    
    let gradelimitstatus:any[]=[];
    this.submitstatusofotherteacher="Y";
    let loggedinid:string="";
    let pck:string=this.awardsheet_params.get("programCourseKey");
    let entity:string=this.awardsheet_params.get("entityId");
    let resultprocessed = false;
    
    this.canSubmit =true;

    if(!(isUndefined(res.courseDetails))) 
      {
      
                gradelimitstatus=res.courseDetails.Details;
                console.log(gradelimitstatus);
               
                let teachers:string;
                  let teacherary=[];

                for(let i=0;i<gradelimitstatus.length;i++)
                {
                  
                  teachers=String(gradelimitstatus[i].employeeId).toString();
                
                  teacherary =teachers.split(",");
                 
                              if( 
                                (String(gradelimitstatus[i].status).toString()==="Not Submitted" ) 
                                //&&
                                //String(gradelimitstatus[i].ownerEntityId).toString() !==String(entity).toString()) ||
                                 
                                //(String(gradelimitstatus[i].status).toString()==="Not Submitted"  &&
                                //String(gradelimitstatus[i].programCourseKey).toString() !==String(pck).toString())
                               
                            ) {

                              if(!teacherary.includes(String(this.authorityHolderId).toString()))
                              this.submitstatusofotherteacher="N";
                             
                              
                              } 


                              if( 
                                (String(gradelimitstatus[i].userId).toString()==="Declared" )) {
                                  resultprocessed=true;

                                }

                              // if not a authority holder  ,check if  its award sheet  is also assigned to Authority Holder
                              // if it is assigned then user can not submit its sheet . 
                              if (!this.gradeauthorityholder){

                          
                                      // if it is a current loggd in user Sheet
                                      if (String(gradelimitstatus[i].ownerEntityId).toString() ===String(entity).toString() &&
                                      String(gradelimitstatus[i].programCourseKey).toString() ===String(pck).toString() &&
                                      String(gradelimitstatus[i].status).toString()==="Not Submitted" 
                                      
                                      )
                                                                    
                                      {
                                        //Scan  authority holder 
                                       
                                      
                                        if(teacherary.includes(String(this.authorityHolderId).toString())){
                                          this.canSubmit =false;
                                          

                                        }
                                      


                                      }
                            }


                    //}
                    
                    
                }
              //   console.log(count);
              //  if(count>0){
              //  this.submitstatusofotherteacher="N";
              
              
              //  }else{
                
              //  }
      }
      else
      {
        
         this.submitstatusofotherteacher="N";
      }
    

      // if authorty holder and other users have not submitted sheet ,do not allow grading
if (this.gradeauthorityholder && 
  this.submitstatusofotherteacher==="N" &&
  String(this.instructorCount).toString()!=="1"
  ){
this.allowEdit="N";
this.userservice.log("Grades can only be entered after all other sheets are submitted");

}

if(resultprocessed){
  this.allowEdit="N";
  this.userservice.log("Result is already Processed ,Grading can not be changed ");
}


this.httpStatus();  // Check submitted status and Load award sheet
    // check the status of sheet of logged in Teacher.

  }

  generatepdf(){
    let obj = {xmltojs:'N',
    method:'None' };   
    obj.method='/awardBlankCorrection/getComponentDetail.htm';
   
    this.userservice.getdata(this.awardsheet_params,obj).subscribe(res=>{
    //this.userservice.log(" in switch detail selected");
    
   let  sessionstartdt = this.awardsheet_params.get("sessionstartdt");
   let  sessionenddt = this.awardsheet_params.get("sessionenddt");
   let  entityName = this.awardsheet_params.get("entityName");
   let  programName = this.awardsheet_params.get("programName");
   let  branchName = this.awardsheet_params.get("branchName");
   let  spclName = this.awardsheet_params.get("spclName");
   let  semesterstartdt = this.awardsheet_params.get("semesterstartdt");
   let  semesterenddt = this.awardsheet_params.get("semesterenddt");
   let  courseCode = this.awardsheet_params.get("courseCode");
   let  displayType = this.awardsheet_params.get("displayType");
   let  semesterCode = this.awardsheet_params.get("semesterCode");

    let reportPath='/AwardSheet/'+sessionstartdt+'-'+sessionenddt+'/'+entityName+
							'/'+semesterstartdt+'-'+semesterenddt+'/'+programName+'_'+branchName+
							'_'+spclName+'_'+semesterCode+'_'+courseCode+
							' '+'('+displayType+')'+'.pdf';
    
  reportPath = this.userservice.url+reportPath;
//console.log(reportPath);
  window.open(reportPath);
  
        })


  }
  generateMergeReport(){
    let obj = {xmltojs:'N',
    method:'None' };   
    obj.method='/mergedAwardBlank/getComponentDetail.htm';
   
    this.userservice.getdata(this.awardsheet_params,obj).subscribe(res=>{
    //this.userservice.log(" in switch detail selected");
    
   
   let  courseCode = this.awardsheet_params.get("courseCode");
   
        let reportPath='/MergedAwardSheets/'+courseCode+'.xls';


    
  reportPath = this.userservice.url+reportPath;
 //console.log(reportPath);
  //window.open(reportPath,"window1","");
  window.open(reportPath);
  
        })


  }


}    // end of class 

    
