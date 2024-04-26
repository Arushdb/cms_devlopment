import { AfterViewChecked, AfterViewInit, Component, ElementRef, Host, Inject, Injectable, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { AgGridEvent, ColDef, ColumnApi, FirstDataRenderedEvent, GridApi, GridOptions, GridReadyEvent, IRowModel, IsRowSelectable, RowClickedEvent, RowNode, ValueGetterParams } from 'ag-grid-community';
import { CustomButtonComponent } from 'src/app/shared/custom-button/custom-button.component';
import { student } from './studentinterface'
import { AgGridAngular } from 'ag-grid-angular';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { SubscriptionContainer } from 'src/app/shared/subscription-container';
import { Location } from '@angular/common';

import { FormGroup } from '@angular/forms';
import { SchoolMainComponent } from '../school-main/school-main.component';
import { SchoolStudentDetailComponent } from '../school-student-detail/school-student-detail.component';
import { NewregistrationComponent } from 'src/app/login/newregistration/newregistration.component';
import { SchoolregistrationService } from 'src/app/services/schoolregistration.service';
import { alertComponent } from 'src/app/shared/alert/alert.component';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-school-student',
  templateUrl: './school-student.component.html',
  styleUrls: ['./school-student.component.css']
})


export class SchoolStudentComponent implements OnInit {



  isRowSelectable: IsRowSelectable;
  subs = new SubscriptionContainer();
  mask: boolean = false;
  gridOptions: GridOptions;
  gridOptionsimport: GridOptions;
  displaystudent = false;
  displaygrid = false;
  registrationform: FormGroup;
  
  studentregdata: student[] = [];
  studentimpdata: student[] = [];
  
  selectedregdata: student[] = [];
  selectedimpdata: student[] = [];

  
  

  myobj: student;
  lastclass: any;
  lastbranch: any[] = [];
  regclass: any;


  spinnerstatus: boolean = false;
  mybutton: CustomButtonComponent;
  public columnDefs: ColDef[];
  public columnDefsimport: ColDef[];

  fileName= 'ExcelSheet.xlsx';
  //public rowData: any[] | null;
  //public rowDataimport: any[] | null;
  //public selectedrecords: any[] | null;


  @ViewChild('agGrid') agGrid: AgGridAngular;

  public defaultColDef: ColDef = {

    // suppressSizeToFit:false,
    resizable: false,
    sortable: true,
    filter: true

  };
  getRowStyle: any;
  suppressRowClickSelection: boolean;
  showimport: boolean;
  regbranch: string;



  constructor(private router: Router,

    private userservice: UserService,
    private schoolservice: SchoolregistrationService,
    private elementRef: ElementRef,
    private location: Location,
    @Host() public myparent1: SchoolMainComponent,
    public dialog: MatDialog

  ) {


  }
  ngOnDestroy(): void {
    this.subs.dispose();
    this.elementRef.nativeElement.remove();
    this.location.back();

  }
  get f() {
    return this.registrationform.controls;
  }
  ngOnInit(): void {
   
    this.displaygrid = false;
    this.gridOptions = <GridOptions>{
      enableSorting: true,
      enableFilter: true
    };
    this.gridOptionsimport = <GridOptions>{
      enableSorting: true,
      enableFilter: true
    };


  }



  displayStudent() {
  
    let obj = {
      "entityId": this.myparent1.selectedschool,
      "programId": this.myparent1.selectedclass,
      "branchCode": this.myparent1.selectedbranch
    };

    this.regclass = this.myparent1.selectedclasslabel;
    this.regbranch = this.myparent1.selectedbranchlabel;
    let serializedForm = JSON.stringify(obj);

    console.log(serializedForm);

    this.subs.add = this.schoolservice.getstudents(serializedForm).subscribe((res) => {

      this.studentregdata = JSON.parse(res);
      //this.rowData = this.studentregdata;
     
      this.displaygrid = true;


      this.isRowSelectable = (params: RowNode) => {
        console.log(params);
        if (params.data.processedflag === "P") {
          this.suppressRowClickSelection = true;
          return false;
        }
        else
          return true;

      };

      this.getRowStyle = params => {

        console.log(params.node);

        if (params.node.data.processedflag === "P") {

          return { background: 'yellow' };
        }
        if (params.node.data.enrolmentno !== "") {

          return { background: 'aqua' };
        }
      };
      this.getlastclass();
    }, error => {
      console.log(error);
    });

  }



  cancel() {

    this.registrationform.reset();
    this.selectedregdata = [];
    this.subs.dispose();
    this.location.back();


  }

  OngridReady(params: GridReadyEvent) {
    //this.agGrid.api.forEachNode((node,index)=>{console.log(node,index)});

    this.columnDefs = [

      { headerName: 'Sq.no', valueGetter: this.hashValueGetter, width: 100},
      { headerName: 'Select', headerCheckboxSelection: false, field: 'select', checkboxSelection: true, suppressSizeToFit: false, width: 30 },
      { headerName: 'Name', field: 'firstName', suppressSizeToFit: false, flex: 1 },
      { headerName: 'Father Name', field: 'fatherFirstName', suppressSizeToFit: false, flex: 1 },
      { headerName: 'Mother Name', field: 'motherFirstName', suppressSizeToFit: false, flex: 1 },
      { headerName: 'Date of Birth', field: 'dateOfBirth', suppressSizeToFit: false, flex: 1 },
      { headerName: 'App Number', field: 'appnumber', suppressSizeToFit: false, flex: 1 },
      { headerName: 'Enrolment Number', field: 'enrolmentno', suppressSizeToFit: false, hide: true },
      { headerName: 'Registration Status', 
      field: 'processedflag', suppressSizeToFit: false, flex: 1 },


    ];

    //params.columnApi.autoSizeAllColumns();
    params.api.sizeColumnsToFit();

    this.gridOptions.columnDefs = this.columnDefs;


  }

  OngridReadyimport(params: GridReadyEvent) {
    //this.agGrid.api.forEachNode((node,index)=>{console.log(node,index)});
   
    this.columnDefsimport = [
      { headerName: 'Sq.no', valueGetter: this.hashValueGetter, width: 100 },
      { headerName: 'Select', headerCheckboxSelection: true, field: 'select', checkboxSelection: true, suppressSizeToFit: false, width: 30 },
      { headerName: 'Roll Number', field: 'appnumber', suppressSizeToFit: false, flex: 1 },
      { headerName: 'Name', field: 'firstName', suppressSizeToFit: false, flex: 1 },
      { headerName: 'Br', field: 'passedbranchName', suppressSizeToFit: false, flex: 1 }


    ];

    params.columnApi.autoSizeAllColumns();
    // params.api.sizeColumnsToFit();

    this.gridOptionsimport.columnDefs = this.columnDefsimport;


  }

  goBack(): void {

    this.displaystudent = false;
    this.selectedregdata = [];
  }



  Onchangedata(registrationform: FormGroup) {
    this.registrationform = registrationform;

    if (this.f.status.value === "valid")
      this.displaystudent = false;

  }

  addStudent() {
    this.displaygrid = false;
    const dialogRef = this.dialog.open(SchoolStudentDetailComponent, {
      height: '100%',

      autoFocus: false, disableClose: true, data: { "parent": this.myparent1, "mode": "add" }
    });

    dialogRef.disableClose = true;


    this.subs.add = dialogRef.afterClosed().subscribe(result => {
      if (result)
        console.log(result);

    });




  }
  hashValueGetter = function (params) {

    return params.node.rowIndex + 1;
  };

  updateStudent() {

    if (this.selectedregdata.length > 1) {
      this.userservice.log("Please select only one record");
      return;
    }
    if (this.selectedregdata[0].enrolmentno !== "") {

      this.userservice.log("You can not update this student");
      let message = "You can not update this student";
      const dialogRef = this.dialog.open(alertComponent,
        {
          data: {
            title: "Warning", content: message,
            ok: true, cancel: false, color: "warn"
          }
        });
      dialogRef.disableClose = true;

      return;
    }



    // if((this.selectedregdata[0].data.enrolmentno!=="")){
    //   return;

    // }
    console.log("selected row", this.selectedregdata);
    console.log("selected row", this.selectedregdata[0].studentNameinHindi);
    console.log(decodeURI(this.selectedregdata[0].studentNameinHindi));
    this.selectedregdata[0].studentNameinHindi = decodeURI(this.selectedregdata[0].studentNameinHindi);
    this.selectedregdata[0].fatherNameinHindi = decodeURI(this.selectedregdata[0].fatherNameinHindi);
    this.selectedregdata[0].motherNameinHindi = decodeURI(this.selectedregdata[0].motherNameinHindi);
    const dialogconfig = new MatDialogConfig();
    dialogconfig.disableClose = true;
    dialogconfig.autoFocus = false;
    dialogconfig.height = '100%';
    dialogconfig.data = {
      "parent": this.myparent1,
      "selectedrow": this.selectedregdata[0], "mode": "update"
    };



    if (this.selectedregdata.length > 0) {

      const dialogRef = this.dialog.open(SchoolStudentDetailComponent, dialogconfig);

      dialogRef.disableClose = true;


      this.subs.add = dialogRef.afterClosed().subscribe(result => {
        if (result)

          this.displayStudent();
      });

    }


  }
  decodeuri(name:string):string{
   let  str:string= decodeURI(name);
  return str; 
  }

  deleteStudent() {
    let serializedobj;

    if(this.selectedregdata.length===0){
      this.userservice.log("Please select record");
      return;
     }

     if(this.selectedregdata.length>1){
      this.userservice.log("Please select only one record");
      return;
     }

    this.selectedregdata.forEach(item => {
      if (item.processedflag === "P") {

        let message = "Student already registered ,Can not delete";
        const dialogRef = this.dialog.open(alertComponent,
          {
            data: {
              title: "Warning", content: message,
              ok: true, cancel: false, color: "warn"
            }
          });
        dialogRef.disableClose = true;


        return;
        }

      });
 
      serializedobj = JSON.stringify(this.selectedregdata[0]);
      let confirm = "N";
      let message = "Please confirm ";
      const dialogRef = this.dialog.open(alertComponent,
        {
          data: {
            title: "Warning", content: message,
            ok: true, cancel: true, color: "warn"
          }

          
        }
      );
      dialogRef.disableClose = true;

      dialogRef.afterClosed().subscribe(res => { if (res) 
        
        this.schoolservice.deletestudent(serializedobj).subscribe(res => {

          this.displayStudent();
        }, err => {
          this.userservice.log("Record can not be deleted");
        });});

     
    }
    



  onSelectionregChanged(event: AgGridEvent) {

    // this.selectedregdata = [];
    // this.studentregdata = [];

   // console.log(this.gridOptions.api.getSelectedNodes());

    // this.selectedregdata = this.gridOptions.api.getSelectedNodes();
    this.selectedregdata = this.gridOptions.api.getSelectedRows();

  }
  onSelectionimpChanged(event: AgGridEvent) {
    
    this.selectedimpdata = this.gridOptionsimport.api.getSelectedRows();
    if (this.selectedimpdata.length > 0) {
      this.showimport = true;
    }
    else {
      this.showimport = false;
    }

   
    
  }

  getlastclass() {

    const lastclass = {
      '0001311': { pgm: '0001310', label: "9th" },
      '0001312': { pgm: '0001311', label: "High School 10th" },
      '0001313': { pgm: '0001312', label: "Eleventh" },


    };

    const lastbranch = {
      'AR': ['AR'],
      'CM': ['CM', 'SM', 'SC', 'SI'],
      'MC': ['CM', 'SM', 'SC', 'SI'],
      'SB': ['SC', 'SM', 'SI'],
      'SC': ['SC', 'SM', 'SI'],
      'SI': ['SC', 'SM', 'SI']

    };
    // if class is 11th then student has a choise for different stream
    if (this.myparent1.selectedclass === "0001312")
      this.lastbranch = lastbranch[this.myparent1.selectedbranch];
    else
      this.lastbranch.push(this.myparent1.selectedbranch);
    console.log(this.lastbranch);


    console.log(lastclass[this.myparent1.selectedclass].pgm);
    this.lastclass = lastclass[this.myparent1.selectedclass].label;
    let myobj: student = {
      appnumber: '',
      firstName: '',
      fatherFirstName: '',
      motherFirstName: '',
      gender: '',
      category: '',
      religion: '',
      physicallyHandicapped: '',
      minority: '',
      perAddress: '',
      perCity: '',
      perState: '',
      perPincode: '',
      officePhone: '',
      extraphone: '',
      aadhaarNumber: '',
      enrolmentno: '',
      studentNameinHindi: '',
      fatherNameinHindi: '',
      motherNameinHindi: '',
      dateOfBirth: '',
      primaryEmailId: '',
      status: '',
      studentId: '',
      programId: '',
      registrationNumber: '',
      entityId: '',
      branchCode: '',
      processedflag: '',
      semester_start_date: '',
      passedprogramId: '',
      passedbranches: [],
      passedbranchName: '',
      branchName: '',
      passedbranchid: '',
      records: '',
      filepath: '',
      mode: ''
    };
    myobj.entityId = this.myparent1.selectedschool;

    myobj.programId = this.myparent1.selectedclass;
    myobj.branchCode = this.myparent1.selectedbranch;

    myobj.passedprogramId = lastclass[this.myparent1.selectedclass].pgm;

    myobj.passedbranches = this.lastbranch;

    let serializedobj = JSON.stringify(myobj);
    console.log(serializedobj);
    this.subs.add = this.schoolservice.lastclass(serializedobj).subscribe(
      res => {

        this.studentimpdata = JSON.parse(res);
        this.studentimpdata.forEach(item => {
          item.programId = this.myparent1.selectedclass;
          item.branchCode = this.myparent1.selectedbranch;
          item.entityId = this.myparent1.selectedschool;

        });
       

        if (this.studentimpdata.length === 0)
          this.userservice.log("No Student found");

      }
    );

  }
  exportStudent(){
    /* pass here the table id */
    let element = document.getElementById('excel-table');
    const ws: XLSX.WorkSheet =XLSX.utils.table_to_sheet(element);
 
    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
 
    /* save to file */  
    XLSX.writeFile(wb, this.fileName);
  }

  importStudent() {
   
    let serializedobj = JSON.stringify(this.selectedimpdata);
    if (this.selectedimpdata.length > 0) {

      this.subs.add = this.schoolservice.importstudents(serializedobj).subscribe(
        res => {
          console.log(res);
          res = JSON.parse(res);
          console.log(res);
          this.displayStudent();
          this.userservice.log("Total Records :" + res[0]["records"] + " imported");
          this.showimport = false;
        }, err => {
          console.log(err);
          this.userservice.log(err.records);
        }

      );


    } else {
      this.userservice.log("Please select record");
    }

  }
}




