import { AfterViewChecked, AfterViewInit, Component, ElementRef, Host, Inject, Injectable, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { AgGridEvent, ColDef, ColumnApi, FirstDataRenderedEvent, GridApi, GridOptions, GridReadyEvent, IRowModel, IsRowSelectable, RowClickedEvent, RowNode, ValueGetterParams } from 'ag-grid-community';
import { CustomButtonComponent } from 'src/app/shared/custom-button/custom-button.component';
import {student} from './studentinterface' 
import { AgGridAngular } from 'ag-grid-angular';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import {  MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { SubscriptionContainer } from 'src/app/shared/subscription-container';
import {Location} from '@angular/common';

import { FormGroup } from '@angular/forms';
import { SchoolMainComponent } from '../school-main/school-main.component';
import { SchoolStudentDetailComponent } from '../school-student-detail/school-student-detail.component';
import { NewregistrationComponent } from 'src/app/login/newregistration/newregistration.component';
import { SchoolregistrationService } from 'src/app/services/schoolregistration.service';


@Component({
  selector: 'app-school-student',
  templateUrl: './school-student.component.html',
  styleUrls: ['./school-student.component.css']
})


export class SchoolStudentComponent implements OnInit  {
  


  isRowSelectable:IsRowSelectable;
  subs = new SubscriptionContainer();
  mask:boolean=false;
  gridOptions: GridOptions;
  displaystudent=false;
  displaygrid=false;
  registrationform: FormGroup;
  _studentdata:any;
  studentdata:student[]=[];
  rowDataselected:any[] =[];
  
  myobj:student;
  gridApi: GridApi;
  gridColumnApi: ColumnApi;
  
  spinnerstatus:boolean=false;
  mybutton:CustomButtonComponent; 
  public columnDefs: ColDef[] ;
  public rowData: any[] | null;
  

  @ViewChild('agGrid') agGrid: AgGridAngular;
  //const gridOptions: GridOptions<PersonalData> ={

 // }

  



//const gridDiv = document.querySelector<HTMLElement>('#myGrid')!;
  public defaultColDef: ColDef = {
   
   // suppressSizeToFit:false,
    resizable: false,
    sortable: true,
    filter: true
  
  };
  getRowStyle:any; 
  suppressRowClickSelection: boolean;
  

 
  constructor(private router:Router,
   
    private userservice:UserService,
    private schoolservice:SchoolregistrationService,

    private elementRef:ElementRef,

   //private dialog:MatDialog,
   //private dialogref:MatDialogRef<StudentpersonaldetailComponent>,
    
    
    private location:Location,
    @Host() public myparent1:SchoolMainComponent,
    public dialog:MatDialog

 

    ) { 

      
  }
  ngOnDestroy(): void {
    this.subs.dispose();
    this.elementRef.nativeElement.remove();
    this.location.back();
   
  }
  get f(){
    return this.registrationform.controls;
  }
  ngOnInit(): void {
  
    this.displaygrid=false;
    this.gridOptions = <GridOptions>{
     enableSorting: true,
     enableFilter: true   } ;
   
     
                
   
  }
  Onchange(){
    // console.log(this.check);
    // this.check?this.agGrid.api.selectAll():this.agGrid.api.deselectAll();
  }
 

  displayStudent(){
  this.rowDataselected=[];
     let obj={
       "entityId":this.myparent1.selectedschool,
       "programId":this.myparent1.selectedclass,
       "branchCode":this.myparent1.selectedbranch
     };
 
    let serializedForm = JSON.stringify(obj);
  
   console.log(serializedForm); 

    this.subs.add=this.schoolservice.getstudents(serializedForm).subscribe((res) => {

      this.studentdata = JSON.parse(res);
      this.rowData=this.studentdata;
      this.displaygrid=true;

       this.isRowSelectable =(params:RowNode)=>{
        console.log(params);
        if (params.data.enrolmentno===""){
          this.suppressRowClickSelection=true;
          return true;
        }
        else
      return false;

      };
    
      this.getRowStyle = params => {
         
        console.log(params.node);
     
        if (params.node.data.enrolmentno!=="") {
          
            return { background: 'yellow'};
        }
    };
      
    }, error => {
      console.log(error);
    });
    
  }

  

cancel(){
 
  this.registrationform.reset();
  this.rowDataselected=[];
  this.subs.dispose();
  this.location.back();

    
}
  
OngridReady(params:GridReadyEvent){
    //this.agGrid.api.forEachNode((node,index)=>{console.log(node,index)});
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.columnDefs = [
           
    { headerName: 'Select', headerCheckboxSelection:true, field: 'select' ,checkboxSelection:true,suppressSizeToFit: false,width:30},
    { headerName: 'Name', field: 'firstName' ,suppressSizeToFit: false,flex:1},
    { headerName: 'Father Name', field: 'fatherFirstName',suppressSizeToFit: false ,flex:1},
    { headerName: 'Mother Name', field: 'motherFirstName' ,suppressSizeToFit: false,flex:1},
    { headerName: 'Date of Birth', field: 'dateOfBirth' ,suppressSizeToFit: false,flex:1},
    { headerName: 'App Number', field: 'appnumber' ,suppressSizeToFit: false,flex:1},
    { headerName: 'Enrolment Number', field: 'enrolmentno' ,suppressSizeToFit: false,hide:true},
    { headerName: 'Registration Status', field: 'processedflag' ,suppressSizeToFit: false,flex:1},
   
      
  ];
          
        params.columnApi.autoSizeAllColumns();
         
      
        this.gridOptions.columnDefs=this.columnDefs;
       
    
  }

  goBack(): void {
 
    this.displaystudent=false;
    this.rowDataselected=[];
  }

  
 
  Onchangedata(registrationform:FormGroup){
    this.registrationform=registrationform;
      
    if(this.f.status.value==="valid")
    this.displaystudent=false;
      
  }

  addStudent(){
  this.displaygrid=false;
    const dialogRef=  this.dialog.open(SchoolStudentDetailComponent,{height: '100%',
    
    autoFocus: false,disableClose:true,data:{"parent":this.myparent1,"mode":"add"}});
    
    dialogRef.disableClose = true;
    

     this.subs.add=dialogRef.afterClosed().subscribe(result => {
  if(result)
 console.log(result);
  
     });

    
  

  }
 

  updateStudent(){

    if(this.rowDataselected.length>1){
     this.userservice.log("Please select only one record");
     return;
    }
    // if((this.rowDataselected[0].data.enrolmentno!=="")){
    //   return;

    // }
    console.log("selected row",this.rowDataselected);
    console.log("selected row",this.rowDataselected[0].data.studentNameinHindi);
    console.log(decodeURI(this.rowDataselected[0].data.studentNameinHindi));
    this.rowDataselected[0].data.studentNameinHindi=decodeURI(this.rowDataselected[0].data.studentNameinHindi);
    this.rowDataselected[0].data.fatherNameinHindi=decodeURI(this.rowDataselected[0].data.fatherNameinHindi);
    this.rowDataselected[0].data.motherNameinHindi=decodeURI(this.rowDataselected[0].data.motherNameinHindi);
    const dialogconfig= new MatDialogConfig();
    dialogconfig.disableClose=true;
    dialogconfig.autoFocus=false;
    dialogconfig.height='100%';
    dialogconfig.data={"parent":this.myparent1,
    "selectedrow":this.rowDataselected,"mode":"update"};



    if(this.rowDataselected.length>0){
      
      const dialogRef=  this.dialog.open(SchoolStudentDetailComponent,dialogconfig);
      
      dialogRef.disableClose = true;
      
  
       this.subs.add=dialogRef.afterClosed().subscribe(result => {
    if(result)
 
     this.displayStudent();
       });
  
      }
    
    
  }
  deleteStudent(){
    if(this.rowDataselected.length>0){
      const dialogRef=  this.dialog.open(SchoolStudentDetailComponent,{height: '100%',
      
      autoFocus: false,disableClose:true,});
      
      dialogRef.disableClose = true;
       
       this.subs.add=dialogRef.afterClosed().subscribe(result => {
    if(result)
   console.log(result);
    this.displayStudent();
     // this.getStudentMarks();
       });
  
      }
  }


  onActSelectionChanged(event:AgGridEvent){
 
    this.rowDataselected=[];
   
     console.log(this.gridOptions.api.getSelectedNodes());
   
    this.rowDataselected=this.gridOptions.api.getSelectedNodes();
  
  }

  
  
}


 
 


function isRowSelectable(): void {
  throw new Error('Function not implemented.');
}

