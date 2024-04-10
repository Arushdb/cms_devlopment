import { Component, ElementRef, Host, Inject, Injectable, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { AgGridEvent, ColDef, FirstDataRenderedEvent, GridApi, GridOptions, GridReadyEvent, IRowModel, RowNode, ValueGetterParams } from 'ag-grid-community';
import { CustomButtonComponent } from 'src/app/shared/custom-button/custom-button.component';
import {PersonalData} from './studentinterface' 
import { AgGridAngular } from 'ag-grid-angular';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import {  MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SubscriptionContainer } from 'src/app/shared/subscription-container';
import {Location} from '@angular/common';

import { FormGroup } from '@angular/forms';
import { SchoolMainComponent } from '../school-main/school-main.component';
import { SchoolStudentDetailComponent } from '../school-student-detail/school-student-detail.component';
import { NewregistrationComponent } from 'src/app/login/newregistration/newregistration.component';


@Component({
  selector: 'app-school-student',
  templateUrl: './school-student.component.html',
  styleUrls: ['./school-student.component.css']
})


export class SchoolStudentComponent implements OnInit {
  


  private gridApi!: GridApi;
  subs = new SubscriptionContainer();
  mask:boolean=false;
  gridOptions: GridOptions;
  displaystudent=false;
  displaygrid=false;
  registrationform: FormGroup;
  _studentdata:any;
  
  rowDataselected:any[] =[];
  
 
  
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
  

 
  constructor(private router:Router,
   
    private userservice:UserService,

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
  
    this.displaygrid=true;
    //this.dialog.open(SchoolStudentDetailComponent);
   // this.mybutton.buttonlabel="update";
   this.gridOptions = <GridOptions>{
    // enableSorting: true,
    // enableFilter: true               
   } ;
   
  

 
  }
  Onchange(){
    // console.log(this.check);
    // this.check?this.agGrid.api.selectAll():this.agGrid.api.deselectAll();
  }



  getStudents(){
    
  }

  

cancel(){
  // this.displaygrid=false;
  // this.displaystudent=false;
  this.subs.dispose();
  this.location.back();
    //this.elementRef.nativeElement.remove();
}
  
OngridReady(parameters:GridReadyEvent){
    //this.agGrid.api.forEachNode((node,index)=>{console.log(node,index)});
    debugger;
    this.columnDefs = [
      // { headerName: " StudentName", checkboxSelection:true,flex:2 },
      // { headerName: "DOB" ,field: "dob", flex: 0.5 },
      // { headerName: " FatherName" ,field: "fathername", flex: 1},
      // { headerName: " MotherName" ,field: "mothername", flex: 1 },
      // { headerName: " Address" ,field: "Address", flex: 2 },
      // { headerName: " Address" ,field: "Address", flex: 2 },

      
      { headerName: 'Select', field: 'select' ,checkboxSelection:true,suppressSizeToFit: false,width:30},
      { headerName: 'Model', field: 'model' ,suppressSizeToFit: false,flex:1},
    { headerName: 'Price', field: 'price',suppressSizeToFit: false ,flex:1},
    { headerName: 'Make', field: 'make' ,suppressSizeToFit: false,flex:1},
    // {
    
    //   headerName: "Update",
    //   resizable: false,
     
    //   width:80,
     
    //   cellRendererFramework: CustomButtonComponent,
    //   cellRendererParams:"Update"
      
             
    // },

    // {
    //   field: "delete",
     
    //   width:80,
    //   headerName: "Delete",
    //   cellRendererFramework: CustomButtonComponent,
    //   cellRendererParams:"Delete",
    //   onCellClicked: this.deletestudent
             
    // },  

      
  ];
    this.rowData = [
      { make: "Tesla", model: "Model Y", price: 64950, electric: true,button:"update" },
      { make: "Ford", model: "F-Series", price: 33850, electric: false ,button:"update"},
      { make: "Toyota", model: "Corolla", price: 29600, electric: false },
      { make: 'Mercedes', model: 'EQA', price: 48890, electric: true },
      { make: 'Fiat', model: '500', price: 15774, electric: false },
      { make: 'Nissan', model: 'Juke', price: 20675, electric: false },
    ];
       // parameters.api.selectAll();
        //this.gridApi = parameters.api;
       //this.gridColumnApi = parameters.columnApi;
        //parameters.api.sizeColumnsToFit();
        parameters.columnApi.autoSizeAllColumns();
        this.gridApi = parameters.api;
       
        debugger;
  
      //  this.check=true;
        //this.suppressRowDeselection=true;
        this.gridOptions.columnDefs=this.columnDefs;
       
        this.getRowStyle = params => {
          
          console.log(params);
          if (params.node.rowIndex % 2 === 0) {
              return { background: 'red' };
          }
      };
  }

  goBack(): void {
 
    this.displaystudent=false;
  }

  
 
  Onchangedata(registrationform:FormGroup){
    this.registrationform=registrationform;

    
   
    if(this.f.status.value==="valid")
    this.displaystudent=false;
      
    

  }

  addStudent(){
  
    const dialogRef=  this.dialog.open(SchoolStudentDetailComponent,{height: '100%',
    
    autoFocus: false,disableClose:true,data:{"parent":this.myparent1}});
    
    dialogRef.disableClose = true;
    

     this.subs.add=dialogRef.afterClosed().subscribe(result => {
  if(result)
 console.log(result);
  
     });

    
  

  }
 

  updateStudent(){
    if(this.rowDataselected.length>0){
      const dialogRef=  this.dialog.open(SchoolStudentDetailComponent,{height: '100%',
      
      autoFocus: false,disableClose:true,});
      
      dialogRef.disableClose = true;
      
  
       this.subs.add=dialogRef.afterClosed().subscribe(result => {
    if(result)
   console.log(result);
     // this.getStudentMarks();
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
     // this.getStudentMarks();
       });
  
      }
  }


  onActSelectionChanged(event:AgGridEvent){
  
    this.rowDataselected=[];
    //console.log(this.gridOptions.api);
    //console.log(this.gridOptions.api.getSelectedNodes());
     console.log(this.gridOptions.api.getSelectedNodes());
    //this.rowDataselected2=this.gridOptions.api.getSelectedRows();
    this.rowDataselected=this.gridOptions.api.getSelectedNodes();
    //console.log("nodes",rowdata);
    //console.log("rows",this.rowDataselected1);
   // this.dialog.open(SchoolStudentDetailComponent);


  }

  
  }

  

 
 


