import { HttpParams } from '@angular/common/http';
import { Component, ComponentFactoryResolver, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild, ɵConsole } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ColDef, ColDefUtil, ColGroupDef, GridOptions, GridReadyEvent, ValueSetterParams } from 'ag-grid-community';
import { UserService } from '../services/user.service';
import {Location} from '@angular/common';

import { AgGridAngular } from 'ag-grid-angular';
import { isUndefined } from 'typescript-collections/dist/lib/util';

import { NumeriCellRendererComponent } from '../numeri-cell-renderer/numeri-cell-renderer.component';
import { CellChangedEvent } from 'ag-grid-community/dist/lib/entities/rowNode';

import { GriddialogComponent } from 'src/app/common/griddialog/griddialog.component';
import { alertComponent } from '../common/alert.component';


import 'node_modules/ag-grid-community/dist/styles/ag-grid.css';
import 'node_modules/ag-grid-community/dist/styles/ag-theme-alpine.css';

import    'src/app/common/subscription-container';
import { subscribeOn } from 'rxjs/operators';
import { SubscriptionContainer } from 'src/app/common/subscription-container';
import { getWeekYearWithOptions } from 'date-fns/fp';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';




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
  
    gradeauthorityholder:boolean=false;
    submitstatusofotherteacher="";

 
 trigger:String="button";
  studentmarks=[];
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
  
  LoggedInUser: string;
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
  sheetstatus: string;
  editgrid: boolean=true;
  allowEdit: string;
  marksEndSemester: any;
  totalMarks: any;
  subjectTotalMarks: any;
  styleCourse: { width: string; height: string; flex: string; };
  private pinnedTopRowData:any[]=[];
  
  styleMarks={
    width: '100%',
    height: '100%',
    flex: '1 1 auto'

  }
  subs = new SubscriptionContainer();
  spinnerstatus: boolean=false;
  gradesCalculated: boolean;
  someoneElseHasAuthority: boolean=false;

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
  this.spinnerstatus=true;
  this.subs.add=this.userservice.getdata(param,obj).subscribe(res=>{
    //this.userservice.log(" in switch detail selected");
    res = JSON.parse(res);
    this.employeeCourseHttpServiceResultHandler(res);

    this.spinnerstatus=false;
   
})
  }


  httpEmployeeCode(param){
    let obj = {xmltojs:'Y',
    method:'None' };   
    this.spinnerstatus=true;
  obj.method='/awardsheet/getEmployeeCode.htm';
  
  this.subs.add=this.userservice.getdata(param,obj).subscribe(res=>{
    //this.userservice.log(" in switch detail selected");
    res = JSON.parse(res);
    this.resultHandlerEmployeeCode(res);
    this.spinnerstatus=false;
  
})
   

    
  }
  resultHandlerEmployeeCode(res){

  }

   employeeCourseHttpServiceResultHandler(res){

  console.log(res);
    if (isUndefined(res.CodeList.root)){
      this.userservice.log("No Subject Assigned");
      this.goBack();

      return;

    }
   
   

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
	this.saveCaller=callingMethod;
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

  console.log(res);
  
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




onRowSelected(event){
 
  if(this.gridOptions.api.getSelectedNodes().length>1){
    this.userservice.log("Please select only One");
    this.gridOptions.api.deselectAll();
    this.setoffButton();
    return;
  }
        
  if(event.node.selected){
    
    this.setoffButton();
    this.displaymkgrid=true;
    this.columnDefsmk =[]; 
    this.componentAC=[];

   this.furtherExecution(event);
  
   

  }else{
 
  
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
    this.awardsheet_params=this.awardsheet_params.set("EmployeeName",event.data.employeeName);
    this.awardsheet_params=this.awardsheet_params.set("approvalOrder","1");


                //Steps
                //  1 :check  status of other sheets if multiple award sheets.:getCourseGradeLimitStatus()

                //  2 :check if grade limit is present or not   method:httprequestgetupdatedgradelimitForSave()
                //  3 :check if user has a grade limit authority method:getCourseAuthorityDetails()
                //  4 :Check award sheet submitted status before loading   this.httpStatus();  
               
                
   
          //this.getCourseGradeLimitStatus(); //check  status of other sheets .
          this.httprequestgetupdatedgradelimitForSave(); // check if grade limit is present or not
          this.getInstructorCountForCourse()
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
      }

      getStudentMarks(){
        //this.displaymkgrid =false;
        this.httpStudentMarksList();

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

     

     //console.log(this.studentXml,res);
  
		this.gradesCalculated=true;
        
       for  (var obj1 of  this.studentXml)
       {
  
                let resultObj:Object=new Object();
              
                resultObj["rollNumber"]=String(obj1.rollNumber).toString();
                            
                resultObj["studentName"]=obj1.studentName;
                resultObj["totalMarks"]="0";
                resultObj["grade"]="";
        //console.log(res.MarksList.marks);

                if(isUndefined(res.MarksList.marks))
                {  // if marks not entered
                        this.submitForApprovalButton=false;
                        for (var obj of this.componentAC)
                          {
                          
                          resultObj[obj.evaluationId]="Z";
                          }
                          this.submitForApprovalButton=false ;
                          this.gradesCalculated=false;

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

                     

        }


        console.log("Sheet status:",this.sheetstatus,"instructor count:",this.instructorCount
        ,"this.gradesCalculated:",this.gradesCalculated,"submitstatusofotherteacher",this.submitstatusofotherteacher
        , "this.gradeauthorityholder",this.gradeauthorityholder,"allowEdit:",this.allowEdit
        ,"this.gradelimitdetail",this.gradelimitdetail,"editgrid",this.editgrid,"someoneElseHasAuthority:",this.someoneElseHasAuthority);
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
                //step-1
                //   if single teacher  and grades are calculated  and authority holder  submit button should be on
                    if(String(this.instructorCount).toString()==="1" && this.gradesCalculated && this.gradeauthorityholder)
                    {
                      this.submitForApprovalButton=true;
                      console.log("Step-1");

                    }
   

                    //step-2
                //if multi teacher  and   authority holder  and  grades calculated 
                // and all other teacher submitted   submit button should  be on

                    if(String(this.instructorCount).toString()!=="1" && this.gradesCalculated
                    && this.submitstatusofotherteacher==="Y"
                    && this.gradeauthorityholder)
                    
                      {
                      this.submitForApprovalButton=true;
                      console.log("Step-2");
                      }
                //step-3      
                //if multi teacher  and  not a authority holder   
                // and some one else has a authority  and  it should not be last sheet for submisiion ,submit button should  be on
                    if(String(this.instructorCount).toString()!=="1" 
                        && !this.gradeauthorityholder
                        //&& this.gradelimitdetail
                        && this.someoneElseHasAuthority
                        && this.submitstatusofotherteacher==="N")
                                                    
                    
                        {
                          this.submitForApprovalButton=true;
                          console.log("Step-3");
                          
                        }

                
                

              }
   
		
              this.setColumnsmk();

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

           // console.log(this.componentAC);

                  this.componentAC.forEach((column: any) => 
                  {
          
                      let definition: ColDef = 
                      { headerName: column.evaluationIdName+"/"+column.group, field: column.evaluationId, width: 105 };
                
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
             {headerName: "Roll Number",  field :'rollNumber' , width: 100,editable:false,pinned: 'left'},
             { headerName: "Student Name",  field :'studentName' , width: 250,editable:false,pinned: 'left'}
           
           ]};
           this.columnDefsmk.push(groupdef);
               
              }
      
        {
          let groupdef:ColGroupDef;
          let columndef: ColDef;
        
     

         this.componentAC.forEach((column: any) =>
          {
         
       
            //groupdef.headerName=column.evaluationIdName+"/"+column.maximumMarks;
            //groupdef.openByDefault=true;
            columndef.headerName=column.evaluationId;
            columndef.field=column.evaluationId;
            columndef.width=100;

            columndef.cellRendererFramework=NumeriCellRendererComponent; 
            columndef.cellRendererParams = {
            values: column.maximumMarks};
            columndef.valueSetter=this.hasValuesetter;
            columndef.editable=this.editgrid;
            //columndef.columnGroupShow(open")
                      
            columndef.suppressNavigable=!this.editgrid;
           // groupdef ={headerName:column.evaluationIdName+"/"+column.maximumMarks,children:[columndef]};
            groupdef.headerName=column.evaluationIdName;
            groupdef.children.push(columndef);
           
  
            
         
         });
         this.columnDefsmk.push(groupdef);
        
      
       
     
        
         //is.columnDefsmk.push()
     
        }
      
      
      //  {
      //  let definition: ColDef;
      //  definition = { headerName: "TotalMarks", field:'totalMarks' , width: 100,editable:false ,pinned: 'right'};
      //  this.columnDefsmk.push(definition);
      //  definition = { headerName: "Grades", field:'grade',  width: 100,editable:false,pinned: 'right' };
      //  this.columnDefsmk.push(definition);

      // }

      
     }
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
          console.log( this.sheetstatus);

          
          this.getEvaluationComponents();
          
         
        //console.log(this.sheetstatus);
     

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

 
  httpSavecell(){
      let obj = {xmltojs:'Y',
      method:'None' };   
      obj.method='/awardsheet/saveStudentMarks.htm';
    
      this.subs.add=this.userservice.postdata(this.awardsheet_params,obj).subscribe(res=>{
    
    
      })
   
  }


 
  oncellValueChanged(event:CellChangedEvent){
   
   
  let colid = event.column.getColId();
  let rowid =event.node.rowIndex;
  let row=this.studentmarks[rowid];
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
            //console.log(res);
   if(!(isUndefined(res.CodeList.root)))
        arrayCollect=res.CodeList.root;
        console.log(arrayCollect);
  
     if(arrayCollect.length===0){  
     
     // this.getInstructorCountForCourse();  // check count of instructor and check authority accordingly
     }else{
      //this.getInstructorCountForCourse();  // check count of instructor and check authority accordingly
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
        //this.userservice.log(" in switch detail selected");
        res = JSON.parse(res);
       // console.log("course mark",res);
        this.httpGetCourseMarks(res);
      
            })
    
  }

      httpGetCourseMarks(res){
   //console.log("Total Marks...................",res,res.courseDetails.Details[0]);
        //var courseMarksXML = event.result as XML;
//	Alert.show(courseMarksXML);
//	var courseArrCol:ArrayCollection=new ArrayCollection();
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
    console.log(res);
    this.instructorCount = res.CodeList.root[0].status;
    console.log(res.CodeList);
    try{
      
           
    if(String(this.instructorCount).toString()==='1' ){
      this.allowEdit="Y";
      this.gradeauthorityholder=true;
      this.getCourseMarks();
      this.getCourseGradeLimitStatus();
    }
       
    else{
      this.allowEdit="N";
     this.userservice.log("More than one teacher is assigned to this subject and  no one has authority to enter grades"); 
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
    console.log("hello");
  }


  submitConfirm(){
  
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width="100%";
    dialogConfig.height="50%";

    const dialogRef=  this.dialog.open(alertComponent,
      {data:{title:"Warning",content:"Please confirm ",ok:true,cancel:true,color:"warn"},
      width:"20%",height:"20%"
      });

      this.subs.add=dialogRef.afterClosed().subscribe((result:boolean) => {
   
    if (result===true){
      this.submitSheet()
    }else{

      return;
    }


    });      

      
  }



  submitSheet(){
    this.awardsheet_params=this.awardsheet_params.set("status","SUB");
    let obj = {xmltojs:'Y',
    method:'None' };   
    obj.method='/awardsheet/submitForApproval.htm';
  
  
    this.subs.add=this.userservice.getdata(this.awardsheet_params,obj).subscribe(res=>{
    //this.userservice.log(" in switch detail selected");
    res = JSON.parse(res);
   
   // console.log("course mark",res);
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

    console.log(this.awardsheet_params);

    this.awardsheet_params=this.awardsheet_params.set("semesterStartDate", this.awardsheet_params.get('semesterstartdt'));
    this.awardsheet_params=this.awardsheet_params.set("semesterEndDate", this.awardsheet_params.get('semesterenddt'));
    
                                            

    this
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

    console.log(res);

    console.log(this.LoggedInUser);
    let gradelimitstatus:any[]=[];
    this.submitstatusofotherteacher="Y";
    let loggedinid:string="";
    let pck:string=this.awardsheet_params.get("programCourseKey")
    let entity:string=this.awardsheet_params.get("entityId")

    if(!(isUndefined(res.courseDetails.Details))) 
      {
      
                gradelimitstatus=res.courseDetails.Details;
                console.log(gradelimitstatus.length);
                let count=0;

                for(let i=0;i<gradelimitstatus.length;i++)
                {
                  
                  console.log(pck,entity,gradelimitstatus[i].status,gradelimitstatus[i].ownerEntityId,gradelimitstatus[i].programCourseKey);
                              if( 
                                (String(gradelimitstatus[i].status).toString()==="Not Submitted"  &&
                                String(gradelimitstatus[i].ownerEntityId).toString() !==String(entity).toString()) ||
                                 
                                (String(gradelimitstatus[i].status).toString()==="Not Submitted"  &&
                                String(gradelimitstatus[i].programCourseKey).toString() !==String(pck).toString())
                               
                            ) {
                              count++;
                              console.log(
                                String(gradelimitstatus[i].status).toString(),"Arush",
                                String(gradelimitstatus[i].programCourseKey).toString(),
                                String(pck).toString(),
                                String(gradelimitstatus[i].ownerEntityId).toString(),
                                String(entity).toString()

                              )
                              
                              }


                    //}
                    
                    
                }
               if(count>0){
               this.submitstatusofotherteacher="N";
               console.log("value of count",count);
               }else{
                console.log("value in else  count",count);
               }
      }
      else
      {
       
         this.submitstatusofotherteacher="N";
      }
    
console.log(this.submitstatusofotherteacher);
this.httpStatus();  // Check submitted status and Load award sheet
    // check the status of sheet of logged in Teacher.

  }

}    // end of class 
    
