import { HttpParams } from '@angular/common/http';
import { Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute, NavigationEnd, Router, UrlSegment } from '@angular/router';
import {  ColDef, GridOptions, GridReadyEvent, ValueSetterParams } from 'ag-grid-community';
import { UserService } from 'src/app/services/user.service';
import {Location} from '@angular/common';
import { isUndefined } from 'typescript-collections/dist/lib/util';
import { GriddialogComponent } from 'src/app/shared/griddialog/griddialog.component';
import { SubscriptionContainer } from 'src/app/shared/subscription-container';
import { AgGridAngular } from 'ag-grid-angular';

@Component({
  selector: 'app-coursegradelimit',
  templateUrl: './coursegradelimit.component.html',
  styleUrls: ['./coursegradelimit.component.css']
})

       
export class CoursegradelimitComponent implements OnInit, OnDestroy {
  @ViewChild('agGrid') agGrid: AgGridAngular;
      
  columnDefs: ColDef[]; 

  param = new HttpParams()
  .set('application','CMS');

  displayType:any;
  awardsheet_params:HttpParams=new HttpParams();
  gridOptions: GridOptions;
  public defaultColDef;
  LoggedInUser: string;
  public courseListGrid=[];
  gradelimitdetail: boolean;
  
  
  style: { width: string; height: string; flex: string; };
  employeeCode: any;
  allowEdit: string="";
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
  instructorCount: any;
    
  constructor(
    private router:Router,
    private userservice:UserService,
    private _Activatedroute:ActivatedRoute,
    private elementRef:ElementRef,
   
    private location:Location,
    public dialog: MatDialog,
    private renderer:Renderer2,

    ) {
      
        
  
          this.subs.add =this.router.events.subscribe((evt) => {
            if (evt instanceof NavigationEnd) {
                        
            }
        });
    


      this.gridOptions = <GridOptions>{
       // enableSorting: true,
       // enableFilter: true               
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

    

      const columns = ['Seq_No','courseCode', 'startDate'];
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

    

    this.spinnerstatus=false;
    this.gridOptions.columnDefs=this.columnDefs;

    this.moduleCreationCompleteHandler();
  
  }

  hashValueGetter = function (params) {
  
    return params.node.rowIndex+1;
  };
  
  moduleCreationCompleteHandler():void{
    this.spinnerstatus=true;

    this.subs.add=this._Activatedroute.data.subscribe(data => { 
    
    this.displayType = "I";
   
    this.employeeCourseHttpService(this.param);
  
});
		

		
	
  }

 
  
  employeeCourseHttpService(param){
    let obj = {xmltojs:'Y',
    method:'None' };   
    obj.method='/coursegradelimitpercourse/getCourseDetails.htm';
    this.spinnerstatus=true;
  
    this.subs.add=this.userservice.getdata(param,obj).subscribe(res=>{
      res = JSON.parse(res);
    this.employeeCourseHttpServiceResultHandler(res);

  
   
})
  }


  httpEmployeeCode(param){
    let obj = {xmltojs:'Y',
    method:'None' };   
  
  obj.method='/awardsheet/getEmployeeCode.htm';
  
  this.subs.add=this.userservice.getdata(param,obj).subscribe(res=>{

  res = JSON.parse(res);
      
  
})
   

    
  }
  resultHandlerEmployeeCode(res){

  }

   employeeCourseHttpServiceResultHandler(res){
   
   console.log(res);
  
    if (isUndefined(res.courseDetails.Details)){
  
      this.userservice.log("No Subject Assigned");
      this.goBack();

      return;

    }
  
   

    let employeeCourse =res.courseDetails.Details;
  
   console.log(employeeCourse);
    
		
    //var param:Object =new Object();
    this.awardsheet_params = this.awardsheet_params.set("time",new Date().toString())
	 
    let param= new HttpParams();
    param.set("time",new Date().toString());
	
		if(String(employeeCourse+"").length==0){
			//this.httpEmployeeCode(param);
		}
		else{
      //employeeCourseArrCol=new ArrayCollection();
      
    let  employeeCourseArrCol=[];

    var count=0;
      
		//	for (var obj of employeeCourse.root){
			for (var obj of employeeCourse){
				employeeCourseArrCol.push({select:false,courseCode:obj.courseCode,entityId:obj.entityId, 
          endDate:obj.endDate,marksEndSemester:obj.marksEndSemester,
          programCourseKey:obj.programCourseKey,sessionEndDate:obj.sessionEndDate,
          sessionStartDate:obj.sessionStartDate,startDate:obj.startDate,
          totalMarks:obj.totalMarks,employeeId:obj.employeeId
        });
			
      
    count++}
			     
      this.courseListGrid=employeeCourseArrCol;
      this.spinnerstatus=false;
     
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
  
    
       
  }


  OnCoursegridReady($event){
    this.styleCourse = {
      width: '100%',
      height: '30%',
      flex: '1 1 auto'
  };
  this.gridOptions.api.setRowData(this.courseListGrid);


}



 	





onRowSelected(event){

  this.userservice.clear();
 
  if(this.gridOptions.api.getSelectedNodes().length>1){
    this.userservice.log("Please select only One");
    this.gridOptions.api.deselectAll();
 
    return;
  }
        
  if(event.node.selected){
   
   
   
    this.spinnerstatus=true;
    
   this.furtherExecution(event);
  
   

  }else{
   
    this.spinnerstatus=false;
    
  }
        
    

}
  furtherExecution(event):void{
   
		this.awardsheet_params=this.awardsheet_params.set("courseCode",event.data.courseCode);
		this.awardsheet_params=this.awardsheet_params.set("entityId",event.data.entityId);
		this.awardsheet_params=this.awardsheet_params.set("programCourseKey",event.data.programCourseKey);
    this.awardsheet_params=this.awardsheet_params.set("employeeId",event.data.employeeId);
    
    this.awardsheet_params=this.awardsheet_params.set("startDate",event.data.startDate);
    this.awardsheet_params=this.awardsheet_params.set("endDate",event.data.endDate);
        
    this.awardsheet_params=this.awardsheet_params.set("sessionEndDate",event.data.sessionEndDate);
    this.awardsheet_params=this.awardsheet_params.set("sessionStartDate",event.data.sessionStartDate);

    this.awardsheet_params=this.awardsheet_params.set("marksEndSemester",event.data.marksEndSemester);
    this.awardsheet_params=this.awardsheet_params.set("totalMarks",event.data.totalMarks);
    this.awardsheet_params=this.awardsheet_params.set("displayType",this.displayType);
    
    this.getInstructorCountForCourse();
      
    
       
         
         
       

          	
        											
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
       

      onclickgradelimitbutton(){
        const dialogConfig = new MatDialogConfig();
      dialogConfig.width="100%";
      dialogConfig.height="50%";
       dialogConfig.data={ 
      courseCode:this.awardsheet_params.get("courseCode"),
      semesterStartDate:this.awardsheet_params.get("startDate"),
      semesterEndDate:this.awardsheet_params.get("endDate"),
      displayType:this.displayType,allowEdit:this.allowEdit,
      sessionStartDate:this.awardsheet_params.get("sessionStartDate"),
      sessionEndDate:this.awardsheet_params.get("sessionEndDate"),
      menuType:"AwardSheet",creatorEntity:this.awardsheet_params.get("entityId"),
      creatorPCK:this.awardsheet_params.get("programCourseKey"),
      creator:this.awardsheet_params.get("employeeId"),
        
      marksEndSemester:this.awardsheet_params.get("marksEndSemester"),
      totalMarks:this.awardsheet_params.get("totalMarks")
        
    };

    const dialogRef=  this.dialog.open(GriddialogComponent,dialogConfig)
    
    this.subs.add=dialogRef.afterClosed().subscribe(result => {
 
 
         });      
  

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
          
           else if (column ==='startDate') {
           
        
           definition.headerName="Sem_Date";
      
           }
    
    
    
    
          this.columnDefs.push(definition);
        });
    
    
        
      }

      getCourseGradeLimitStatus(){

    

        this.awardsheet_params=this.awardsheet_params.set("semesterStartDate", this.awardsheet_params.get('startDate'));
        this.awardsheet_params=this.awardsheet_params.set("semesterEndDate", this.awardsheet_params.get('endDate'));
        
                                                
    
        
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
        let submitstatusofotherteacher="";
      
        this.allowEdit="";
        let resultprocessed = false;
        let authorityHolderId =this.awardsheet_params.get("employeeId");

         
      
        
        if(!(isUndefined(res.courseDetails))) 
          {
          
                    gradelimitstatus=res.courseDetails.Details;
                    
                   
                    let teachers:string;
                    let teacherary=[];
    
                    for(let i=0;i<gradelimitstatus.length;i++)
                    {
                      
                      teachers=String(gradelimitstatus[i].employeeId).toString();
                                        
                      teacherary =teachers.split(",");

                       //Case 1 : sheets are  not submitted
                                           
                                  if( 
                                    (String(gradelimitstatus[i].status).toString()==="Not Submitted" ) 
                                    
                                   
                                ) {
                                
                                 // Sheets are not submitted by other teacher who is not grade authority holder
                                  if(!teacherary.includes(String(authorityHolderId).toString()))
                                {
                                
                                 this.allowEdit="N";
                                 this.userservice.log("Grades can only be entered after all other sheets are submitted");
                                 break;

                                }

                                 


                                  
                                  } 

                                 //Case 2 : sheet are submitted

                                  if( 
                                    (String(gradelimitstatus[i].status).toString()==="Approved" ) 
                                    
                                   
                                ) {
                                 // if grade authority holder is teacher   and sheet is submitted 
                 
                               
                                  if(teacherary.includes(String(authorityHolderId).toString()))
                                  {
                                   
                                   this.allowEdit="N";
                                   this.userservice.log("You can not do grading now as your award sheet is already submitted");
                                   this.spinnerstatus=false;
                                   break;
                                   
                                   
  
                                  }
                                
                                   // if grade authority holder is not a  teacher   and sheet has a single teacher.
                                  if(!(teacherary.includes(String(authorityHolderId).toString())) && 
                                  String(this.instructorCount).toString()==="1"
                                  ){
                                    this.allowEdit="N";
                                    this.userservice.log("Single Teacher:You can not do grading now as award sheet is already submitted");
                                   this.spinnerstatus=false;
                                   break;


                                  }

                                  
                                    
                                    } 

    
                                  if( 
                                    (String(gradelimitstatus[i].userId).toString()==="Declared" )) {
                                      resultprocessed=true;
                                      break;
    
                                    }
    
                        
                        
                    }
                  
          }
          else
          {
            
             submitstatusofotherteacher="N";
          }
        
    
          // if authorty holder and other users have not submitted sheet ,do not allow grading
    if (
      submitstatusofotherteacher==="N" 
      
      ){
    this.allowEdit="N";
    this.userservice.log("Grades can only be entered after all other sheets are submitted");
    
    
    }
    
    if(resultprocessed){
      this.allowEdit="N";
      this.userservice.log("Result is already Processed ,Grading can not be changed ");
      
    }
    if(this.allowEdit==="")
    this.allowEdit="Y";
  this.spinnerstatus=false;
    this.onclickgradelimitbutton();
    
    
    
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
        this.getCourseGradeLimitStatus();       

      }
 
  /// Check sheet status of other user ie is it submitted or not 


}    // end of class 
    
