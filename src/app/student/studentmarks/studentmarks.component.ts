import { HttpParams, HttpResponse } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, Renderer2} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ViewChild } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import {Location} from '@angular/common';
import { CellEditingStoppedEvent, CellFocusedEvent, CellMouseOutEvent, ColDef, ColDefUtil, ColGroupDef, GridOptions, GridReadyEvent, RowDoubleClickedEvent, StartEditingCellParams, ValueSetterParams } from 'ag-grid-community';
import { isUndefined } from 'typescript-collections/dist/lib/util';
import { NumeriCellRendererComponent } from '../../shared/numeri-cell-renderer/numeri-cell-renderer.component';

import * as Collections from 'typescript-collections';
//import {ProgressSpinnerMode} from '@angular/material/progress-spinner';
import {MyItem} from 'src/app/interfaces/my-item';

import {UserService} from  'src/app/services/user.service' ;
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

import {alertComponent} from  'src/app/shared/alert/alert.component'

import { CustomComboboxComponent } from 'src/app/shared/custom-combobox/custom-combobox.component';
//import { GridReadyEvent } from 'ag-grid-community';
import { SubscriptionContainer } from 'src/app/shared/subscription-container';




@Component({
  selector: 'app-studentmarks',
  templateUrl: './studentmarks.component.html',
  styleUrls: ['./studentmarks.component.css']
})
export class StudentmarksComponent implements OnInit {
  //  @ViewChild('agGrid') agGrid: AgGridAngular;
   @ViewChild('mkGrid') mkGrid: AgGridAngular;
@ViewChild('rollNumberCombo') rollNumberCombo: CustomComboboxComponent;
@ViewChild('semesterCombo') semesterCombo: CustomComboboxComponent;
@ViewChild('courseCombo') courseCombo: CustomComboboxComponent;
combowidth: string;
public displaybutton: boolean =false;
public displaySemester: boolean =false;
public displayCourses: boolean =false;
public displaymkgrid: boolean=false;
editgrid: boolean=false;
// awardsheet_params:HttpParams=new HttpParams();
gridOptionsmk: GridOptions;
//suppressRowDeselection = false;
check=false;
subs = new SubscriptionContainer();

mydefaultColDef: {
  editable: false,
  sortable: true,
  flex: 1,
  minWidth: 100,
  filter: true,
  resizable: true,
  
  };
 
  studentmarks=[];
  componentAC:any[];
  // columnDefs: ColDef[]; 
  studentXml:any[]=[];
  public columnDefsmk : ColDef[]=[];     


//  mode: ProgressSpinnerMode = 'indeterminate';
// color: ThemePalette = 'primary';
// value = 50;

constructor(private router:Router,
  private userservice:UserService,
  private route:ActivatedRoute,
  private elementRef:ElementRef,
  
  
  private location:Location,
  public dialog: MatDialog,
  private renderer:Renderer2

  ) { 


    this.gridOptionsmk = <GridOptions>{
      enableSorting: true,
      enableFilter: true               
    } ;
    
}
ngOnDestroy(): void {
  this.subs.dispose();
  this.elementRef.nativeElement.remove();
 
}


// columnDefsmk  clear it everytime while creating grid



ngAfterViewInit(): void {
  
}

// OnSelectAll(){
//   this.agGrid.api.selectAll();
// }
Onchange(){
  console.log(this.check);
  // this.check?this.agGrid.api.selectAll():this.agGrid.api.deselectAll();
}

OngridReady(parameters:GridReadyEvent){
  // this.agGrid.api.forEachNode((node,index)=>{console.log(node,index)});

  this.gridOptionsmk.api.setColumnDefs(this.columnDefsmk);

  // if(this.columnDefsmk.length>0)
      this.gridOptionsmk.api.setRowData(this.studentmarks);


//     if(this.mincreditrequired===this.maxcreditrequired){
//       parameters.api.selectAll();
    
//       this.check=true;
//       //this.suppressRowDeselection=true;

// }
this.spinnerstatus=false;
}

ngOnInit(): void {
  console.log("ngOninit called");
  this.combolabel = "Enter Roll Number" ;
   this.combowidth = "100%";
  this.getRollNumber();
}
itemselected:MyItem;
combolabel:string;
semestercombolabel:string;
coursecombolabel:string;
 mask:boolean=false;
 pgm: any;
 branch: any;
 spec: any;
 sem: any;
 maxcredit: any;
 mincredit: any;
 attempt: any;
 crselected: any;
 entity: any;
 displayType:any;

  title = 'my-app';
semDetail:any;
 tencode:any;
 studentDetail:any;
 url:string;
 urlPrefix:string;

 programId:string;
 branchId:string;
 specializationId:string;
  entityId:string;
 semester:string;

 semesterStartDate:string;
 semesterEndDate:string
 pck:string;
 creditavailable:number;
 creditselected:number;

 credittheory:number;
 creditpractical:number;
 maxcreditrequired:number;
 mincreditrequired:number;
 attemptno:number;
 wrkAC:any;
 selectedbranchId:string ;
 selectedspcId:string;
 selectedCourse:string;


  
 
 regdataAC:any ;
 //selecteddata=new Collections.Set<string>();
   selecteddata:string=""; 
 studentdetailAC:any ;

 spinnerstatus:boolean=false;

public myrowData=[];

 selectedNodes:any;


defaultColDef = {
  sortable: true,
  filter: true
     
};
hashValueGetter = function (params) {
return params.node.rowIndex;
};

columnDefs = [
{
  headerName: 'Seq No',
  maxWidth: 100,
  valueGetter: this.hashValueGetter,
},
{ field: 'courseCode',checkboxSelection: true  },
{ field: 'coursename' },
{ field: 'credits' }
];


 params = new HttpParams()
.set('application','CMS');

myparam = new HttpParams()
.set('application','CMS');

public rollNumberdata :MyItem []=[];
public semesterdata :MyItem []=[];
public coursedata :MyItem []=[];






getRollNumber(){
    let obj = {xmltojs:'Y',
    method:'/studentMarksSummary/getStudentRollNumber.htm' };   
   this.mask=true;
   this.subs.add=  this.userservice.getdata(this.params,obj).subscribe(res=>{
        res= JSON.parse(res);
        this.getRollNumberSuccess(res);
        this.mask=false;
        
       });

      

      }

      getRollNumberSuccess(res){
        //let data = null;
        console.log("getRollNumberSuccess",res);
        // let myparam = {};
        this.rollNumberdata=[];
        
        for(var obj of res.StudentMarksSummary.rollNumber){
          this.rollNumberdata.push({id:obj.rollNo.toString(),label:obj.rollNo+"-"+obj.programName+"-"+obj.branchName+"-"+obj.specialization});
        }
        
        
        
           this.combolabel = "Enter Roll Number" ;
           this.semestercombolabel = "Enter Semester" ;
           this.coursecombolabel = "Enter Course Code" ;
           this.combowidth = "100%";
           console.log("In Module",this.rollNumberdata); 
          
            return;
            
        
          
        
        }  


 OnRollNumberselected(obj){
  this.displaymkgrid=false;
  this.displayCourses=false;
   if(obj.id==="-1"){
    this.displaySemester =false;
   }else{
    this.displaySemester =true;
    this.itemselected=obj; 
   }
   console.log("on RollNumber selected",obj);


    // let myparam =  new HttpParams();
  
  //  myparam["rollNumber"] =this.itemselected.id;

   this.myparam=this.myparam.set("rollNumber",this.itemselected.id);
  //  myparam["programCourseKey"]=programCourseKey;
  //  params["time"] = new Date();
console.log(this.myparam);
   let objGetSemester = {xmltojs:'Y',
    method:'/marksInfo/getRegisteredSemesterList.htm' };   
   this.mask=true;
   this.subs.add=  this.userservice.getdata(this.myparam,objGetSemester).subscribe(res=>{
        res= JSON.parse(res);
        this.getSemesterSuccess(res);
        this.mask=false;
        
       });

 }




//public function
getSemesterSuccess(res){
  //let data = null;
  console.log("getSemesterSuccess",res);
  let myparam = {};
  
  // semesterSummaryWindow.semesterLbl.text=semesterDislpay.selectedItem.semesterName;	
  // semesterSummaryWindow.semesterStartDateLbl.text=semesterSummaryDetail.semesterSummary.semesterStartDate;
  // semesterSummaryWindow.semesterEndDateLbl.text=semesterSummaryDetail.semesterSummary.semesterEndDate;
  
  this.semesterdata=[];

  for(var obj of res.Details.courseDetail){
    this.semesterdata.push({label:obj.semesterCode.toString(),
      id:obj.semesterCode+" "+obj.semesterStartDate+" "+obj.semesterEndDate+" "+obj.programId+" "+
    obj.branchId+" "+obj.specializationId+" "+obj.programCourseKey+" "+obj.entityId});
  }
  
     this.combolabel = "Enter Semester" ;
     this.combowidth = "100%";
     console.log("In Module",this.semesterdata); 
    
      return;
      
  
  }  



 OnOptionselected(obj){
  this.displaymkgrid=false;
  if(obj.id==="-1"){
   this.displaybutton =false;
  }else{
   this.displaybutton =true;
   this.itemselected=obj; 
  }
  console.log("on option selected",obj);
  this.myparam=this.myparam.set("courseCode",this.itemselected.id);
  this.myparam=this.myparam.set("displayType","I");
}

OnSemesterselected(obj){
  this.displaymkgrid=false;
  if(obj.id==="-1"){
   this.displayCourses =false;
  }else{
   this.displayCourses =true;
   this.itemselected=obj; 
  }
  console.log("on Semester selected",obj);



  var newarr = this.itemselected.id.split(" ");


  // this.myparam=this.myparam.set("rollNumber",this.itemselected.label);
  this.myparam=this.myparam.set("semesterStartDate",newarr[1]);
  this.myparam=this.myparam.set("semesterEndDate",newarr[2]);
  this.myparam=this.myparam.set("semesterCode",newarr[0]);
  this.myparam=this.myparam.set("programId",newarr[3]);
  this.myparam=this.myparam.set("branchId",newarr[4]);
  this.myparam=this.myparam.set("specializationId",newarr[5]);
  this.myparam=this.myparam.set("programCourseKey",newarr[6]);
  this.myparam=this.myparam.set("entityId",newarr[7]);
  this.myparam=this.myparam.set("universityId","0001");


  console.log("on Semester selected parameters",this.myparam);
  let objGetCourses = {xmltojs:'Y',
    method:'/marksInfo/getRegisteredCourseList.htm' };   
   this.mask=true;
   this.subs.add=  this.userservice.getdata(this.myparam,objGetCourses).subscribe(res=>{
        res= JSON.parse(res);
        this.getCourseSuccess(res);
        this.mask=false;
        
       });

}
   
getCourseSuccess(res){
  //let data = null;
  console.log("getCourseSuccess",res);
  let myparam = {};
  
  // semesterSummaryWindow.semesterLbl.text=semesterDislpay.selectedItem.semesterName;	
  // semesterSummaryWindow.semesterStartDateLbl.text=semesterSummaryDetail.semesterSummary.semesterStartDate;
  // semesterSummaryWindow.semesterEndDateLbl.text=semesterSummaryDetail.semesterSummary.semesterEndDate;
  this.coursedata=[];
  
  for(var obj of res.Details.courseDetail){
    this.coursedata.push({id:obj.courseCode.toString(),label:obj.courseCode});
  }
  
     this.combolabel = "Enter Course" ;
     this.combowidth = "100%";
     console.log("In Module",this.coursedata); 
    
      return;
      
  
  }  



onContinue(){
  this.spinnerstatus=true;
  this.selectedCourse=this.itemselected.id;
  this.myparam=this.myparam.set("courseCode",this.itemselected.id);
  this.myparam=this.myparam.set("displayType","I");

  this.getEvaluationComponents();
  // this.awardsheet_params = this.awardsheet_params.set("time",new Date().toString());

}

getEvaluationComponents(){
  console.log(this.myparam);
  let obj = {xmltojs:'Y',
  method:'None' };   
obj.method='/awardsheet/getEvaluationComponents.htm';

this.subs.add=this.userservice.getdata(this.myparam,obj).subscribe(res=>{
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
obj.method='/marksInfo/getStudentListANG.htm';

this.subs.add=this.userservice.getdata(this.myparam,obj).subscribe(res=>{
//this.userservice.log(" in switch detail selected");
res = JSON.parse(res);
this.resultHandlerStudent(res);

})

}
resultHandlerStudent(res){


if(isUndefined(res.Details.studentDetail)){
this.userservice.log("No Student found");
this.setoffButton();

return;
}

this.studentXml=[];

this.studentXml=res.Details.studentDetail;


this.getStudentMarks();


}

setoffButton(){

// this.submitForApprovalButton=false;
// this.gradelimitButton=false;
// this.editgrid=false;
// this.saveButton=false;
// this.spinnerstatus=false;
}

getStudentMarks(){
this.spinnerstatus=true;
//this.displaymkgrid =false;
this.httpStudentMarksList();

}

httpStudentMarksList(){
let obj = {xmltojs:'Y',
method:'None' };   
obj.method='/marksInfo/getStudentMarks.htm';

this.subs.add=this.userservice.getdata(this.myparam,obj).subscribe(res=>{
//this.userservice.log(" in switch detail selected");
res = JSON.parse(res);
this.resultHandlerStudentMarks(res);


})


}
resultHandlerStudentMarks(res)
{

this.studentmarks=[];

              // this.submitForApprovalButton=false;
              // this.gradelimitButton=true;
              // this.editgrid=true;
              // this.saveButton=true;

              let marksEntered =true;



// this.gradesCalculated=true;

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

console.log("before isUndefined(res.Details.marksDetail)");
        if(isUndefined(res.Details.marksDetail))
        {  
                // this.submitForApprovalButton=false;
               
                //   this.submitForApprovalButton=false ;
                //   this.gradesCalculated=false;
                  marksEntered=false;

        }
        else
        {

               for (var obj2 of  res.Details.marksDetail)
               {

                  if(String(obj1.rollNumber).toString()===String(obj2.rollNumber).toString())
                  {
                    
                            if(String(obj2.marks).toString()!=="" )
                                resultObj[obj2.evaluationId]=obj2.marks;
                              
                            else
                            {
                                resultObj[obj2.evaluationId]="Z";
                                // this.submitForApprovalButton=false;
                                // this.gradesCalculated=false;
                                marksEntered=false;
                            }

                            if(String(obj2.attendence).toString()=== "ABS" )
                              resultObj[obj2.evaluationId]="A";
            
                            // if(this.displayType.toString()==="I"  )
                            // { 
                              resultObj["grade"]=obj2.internalGrade;
                              resultObj["totalMarks"]=obj2.totalInternal;	
                              resultObj["totalInternal"]=obj2.totalInternal;	
                                            
                            // }

                            // if(this.displayType.toString()==="E")
                            // { 
                            //   resultObj["grade"]=obj2.externalGrade;
                            //   resultObj["totalMarks"]=obj2.totalExternal;	
                            //   resultObj["totalExternal"]=obj2.totalExternal;	
                                
                            // }

                            // if(this.displayType.toString()==="R")
                            // { 
                            //   resultObj["grade"]=obj2.internalGrade;
                            //   resultObj["totalMarks"]=obj2.totalInternal;	
                            //   resultObj["totalInternal"]=obj2.totalInternal;	
                              
                            // }
                            

                           
                            if(
                              
                              (String(resultObj["grade"]).toString().trim()==="") ||
                              (String(resultObj["grade"]).toString()==="X")
                            )
                            {
                              // this.submitForApprovalButton=false ;
                              // this.gradesCalculated=false;
                            }
        
                  }else{      // no marks record present in Student Marks
                              
                  }      
     
                }
          }

console.log("this.studentmarks.push(resultObj);");

              this.studentmarks.push(resultObj);
          // check if any evaluation ID is left with Z value
              for (let obj of this.componentAC)
              {
              if(resultObj[obj.evaluationId]==="Z"){
                // this.submitForApprovalButton=false;
                marksEntered=false;

              }
                
              }
              
              // this.spinnerstatus=false;

}
    




/// set up buttons now
      

  

        //step-3       for Internal award sheet only
        //if multi teacher  and  not a authority holder   
        // and some one else has a authority  and authority holder is not assigned its sheet ,submit button should  be on
            // if(String(this.instructorCount).toString()!=="1" 
            //     && !this.gradeauthorityholder
            //     //&& this.gradelimitdetail
            //     && this.someoneElseHasAuthority
            //     //&& this.submitstatusofotherteacher==="N"
            //     && marksEntered 
            //     && this.canSubmit
            //     && this.displayType=="I"
            //     && this.courseType=="Reg"
                
            //     )
                                            
            
                // {
                //   this.submitForApprovalButton=true;
                //   console.log("Step-3");
                  
                // }

        this.spinnerstatus=false;
        this.displaymkgrid=true;
                this.setNewColumnsmk();

      }
      // console.log("Sheet status:",this.sheetstatus,"instructor count:",this.instructorCount
      // ,"this.gradesCalculated:",this.gradesCalculated,"submitstatusofotherteacher",this.submitstatusofotherteacher
      // , "this.gradeauthorityholder",this.gradeauthorityholder,"allowEdit:",this.allowEdit
      // ,"this.gradelimitdetail",this.gradelimitdetail,"editgrid",this.editgrid,"someoneElseHasAuthority:",
      // this.someoneElseHasAuthority,"marksEntered:",marksEntered,"canSubmit:", this.canSubmit);


      // if(this.courseType=="Reg")
      // this.setNewColumnsmk();
      // else
      // this.setcoreColumnsmk();
      


setColumnsmk()
{

  this.columnDefsmk=[];
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
              { headerName: column.evaluationIdName+"/"+column.maximumMarks+"/"+column.group, field: column.evaluationId, width: 125,editable:false };
        
            // definition.cellRendererFramework=NumeriCellRendererComponent; 
            // definition.cellRendererParams = {
            // values: column.maximumMarks};
            // definition.valueSetter=this.hasValuesetter;
            // definition.editable=false;
            
                      
            // definition.suppressNavigable=!this.editgrid;
          
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
  console.log("in setNewColumnsmk()" );
  this.columnDefsmk=[];
      {
  let groupdef:ColGroupDef;
  let columndef: ColDef;

    groupdef={headerName:"Course Code: "+this.selectedCourse, children: [
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



hasValuesetter=function(params:ValueSetterParams):boolean{

  console.log("hasValuesetter=function(params:ValueSetterParams)");
        
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
                  // columndef.tooltipValueGetter= this.tooltipgetter;

                  // columndef.cellRendererFramework=NumeriCellRendererComponent; 
                  // columndef.cellRendererParams = {
                  // values: column.maximumMarks};
                  // columndef.valueSetter=this.hasValuesetter;
                  columndef.editable=false;
                  // columndef.suppressNavigable=!this.editgrid;
                  children.push(columndef);

              }

          });
         
  return children;
}




}

 