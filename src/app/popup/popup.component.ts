import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { HttpParams } from '@angular/common/http';
import { ElementRef, OnDestroy, Renderer2, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute, NavigationEnd, Router, UrlSegment } from '@angular/router';
import { ColDef, GridOptions, GridReadyEvent, ValueSetterParams, ColumnApi } from 'ag-grid-community';
import { UserService } from 'src/app/services/user.service';
import { Location } from '@angular/common';
import { isUndefined } from 'typescript-collections/dist/lib/util';
import { GriddialogComponent } from 'src/app/shared/griddialog/griddialog.component';
import { SubscriptionContainer } from 'src/app/shared/subscription-container';
import { AgGridAngular } from 'ag-grid-angular';
import { PopupService } from './popup.service';
import { DataServiceService } from '../data-service.service';
import { gridColumndef } from '../interfaces/gridColumnDef';
import { analyzeAndValidateNgModules } from '@angular/compiler';
import { environment } from '../../environments/environment'; //'src/environments/environment'
import { MessageService } from 'src/app/services/message.service'
import { alertComponent } from 'src/app/shared/alert/alert.component';




@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.css']
})
export class PopupComponent implements OnInit {
  @ViewChild('agGrid') agGrid: AgGridAngular;

  rowData: any;
  gradeLimit: number[] = Array(11).fill(Number.MAX_VALUE);
  url: string;
  Validate: boolean;
  cellUpdateCounter = 0;
  private params:any;
  lower: string;
  entity: string;
  pck: string;
  subs = new SubscriptionContainer();
  onSave:boolean;
  courseCode: any;
  programId: any;
  semesterStartDate: any;
  semesterEndDate: any;
  displayType: any;
  totalMarks: any;
  marksEndSem: any;
  sessionStartDate: any;
  sessionEndDate: any;
  programCourseKey: any;
  entityId: any;


  constructor(public dialogRef: MatDialogRef<PopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, 
    private dataService: DataServiceService, 
    private messageService: MessageService,
    public dialog: MatDialog,
    private location:Location) {

  }

  ngOnInit(): void {
    this.rowData = this.dataService.getData();
    if (this.rowData.length === 0) {
      this.rowData = [{ Subject: this.data,gradeF:0}];
    }
    // Set Grade F to 0
    this.gradeLimit[10]=0
    this.params = this.dataService.getParams();
    this.initializeGradeParams();
  }
  // Setting Parameters 
  initializeGradeParams() {
    if (this.params) {
      this.courseCode = this.params.courseCode;
      this.semesterStartDate = this.params.semesterStartDate;
      this.semesterEndDate = this.params.semesterEndDate;
      this.displayType = this.params.displayType;
      this.totalMarks = this.params.totalMarks;
      this.marksEndSem = this.params.marksEndSem;
      this.sessionStartDate = this.params.sessionStartDate;
      this.sessionEndDate = this.params.sessionEndDate;

    }
    
  }
  goHome(){
    this.location.back()
  }
  closeDialog(): void {
    this.dialogRef.close();
  }
  columnDefs = [
    { headerName: 'Subject', field: 'Subject', editable: false, width: 120 },
    { headerName: 'A', field: 'gradeA', cellEditor: 'agTextCellEditor', valueSetter: this.valueSetter.bind(this) },
    { headerName: 'A-', field: 'gradeA-', cellEditor: 'agTextCellEditor', valueSetter: this.valueSetter.bind(this) },
    { headerName: 'B', field: 'gradeB', cellEditor: 'agTextCellEditor', valueSetter: this.valueSetter.bind(this) },
    { headerName: 'B-', field: 'gradeB-', cellEditor: 'agTextCellEditor', valueSetter: this.valueSetter.bind(this) },
    { headerName: 'C', field: 'gradeC', cellEditor: 'agTextCellEditor', valueSetter: this.valueSetter.bind(this) },
    { headerName: 'C-', field: 'gradeC-', cellEditor: 'agTextCellEditor', valueSetter: this.valueSetter.bind(this) },
    { headerName: 'D', field: 'gradeD', cellEditor: 'agTextCellEditor', valueSetter: this.valueSetter.bind(this) },
    { headerName: 'D-', field: 'gradeD-', cellEditor: 'agTextCellEditor', valueSetter: this.valueSetter.bind(this) },
    { headerName: 'E', field: 'gradeE', cellEditor: 'agTextCellEditor', valueSetter: this.valueSetter.bind(this) },
    { headerName: 'E-', field: 'gradeE-', cellEditor: 'agTextCellEditor', valueSetter: this.valueSetter.bind(this) },
    { headerName: 'F', field: 'gradeF',editable: false },
  ];
  fieldIndexMap = {
    'gradeA': 0,
    'gradeA-': 1,
    'gradeB': 2,
    'gradeB-': 3,
    'gradeC': 4,
    'gradeC-': 5,
    'gradeD': 6,
    'gradeD-': 7,
    'gradeE': 8,
    'gradeE-': 9,
    'gradeF':10
  };

  public defaultColDef: ColDef = {
    flex: 1,
    editable: true,
    width: 65,
  };
  public gridOptions: GridOptions = {
    stopEditingWhenGridLosesFocus: false,
  };

  areAllFieldsFilled(gradeLimits: number[]): boolean {
    if (gradeLimits.every(mark => mark !== Number.MAX_VALUE)) {
      console.log("All Fields are Filled");
      return true;
    }
    console.log("All Fields are not filled");
    console.log(this.messageService);
  }
  updatedCells = new Set();
  totalCells = 10;




  valueSetter(params: ValueSetterParams): boolean {


    const currentIndex = this.fieldIndexMap[params.colDef.field];

    // Check if the input is numeric
    if (!isNaN(params.newValue)) {
      const newValue = parseFloat(params.newValue);

      // Ensure the new value respects the constraints
      if (currentIndex === 0 && newValue <= 150) {
        params.data[params.colDef.field] = newValue;
        this.gradeLimit[currentIndex] = newValue;

        if (this.cellUpdateCounter <= this.totalCells) {
          this.cellUpdateCounter++;
        }

        this.updatedCells.add(params.node.id + params.colDef.field);
        console.log(this.updatedCells.size);
      } else if (currentIndex > 0 && newValue < this.gradeLimit[currentIndex - 1]) {
        params.data[params.colDef.field] = newValue;
        this.gradeLimit[currentIndex] = newValue;

        if (this.cellUpdateCounter <= this.totalCells) {
          this.cellUpdateCounter++;
        }
        this.updatedCells.add(params.node.id + params.colDef.field);
        console.log(this.updatedCells.size);
      } else {
        window.alert("Invalid input")
      }
    } else {
      window.alert("Invalid input")
    }

    console.log(`Updated ${params.colDef.field} to ${params.data[params.colDef.field]}`);
    if (this.updatedCells.size === this.totalCells) {
      console.log('The grid is fully updated');
      this.Validate = true;
    }
    return true;

  }
  hasDuplicates(gradeLimits: number[]): boolean {
    const uniqueValues = new Set(gradeLimits);
    if (uniqueValues.size == gradeLimits.length) {
      console.log("No Duplicates Found")
      return true;
    }
    window.alert("Duplicates Found")
    return false;
  }

  isValidated(gradeLimits: number[]): boolean {
    if (this.updatedCells.size == this.totalCells) {
      if (this.isSorted(gradeLimits) && this.areAllFieldsFilled(gradeLimits) && this.hasDuplicates(gradeLimits)) {
        return true;
      }
      return false;

    }
  }
  isSorted(gradeLimits: number[]): boolean {
    var flag = 1
    for (let i = 0; i < gradeLimits.length-1; i++) {
      if (gradeLimits[i] >= gradeLimits[i + 1]) {
        continue;

      }
      else {
        flag = 0
        window.alert(" Grade Limits not in sorted order ");
        break;
      }

    }
    if (flag == 1) {
      console.log("Data is Sorted")
      return true;
    }
    return false;
  }
  Save() {
    // Get the current row data from the grid
    const rowData = [];
    this.agGrid.api.forEachNode(node => rowData.push(node.data));
    const gradeLimits = rowData.map(row => row.gradeLimit)

    // Validating the gradeLimit
    if (this.isValidated(this.gradeLimit)) {
      console.log("Data Validated")
      this.onSave=true;
      this.dataService.saveData(rowData);
    }

    else {
      this.onSave=false;
    }

  }


  saveGradeLimit() {
    const grades: string = "A" + "|" + "A-" + "|" + "B" + "|" + "B-" + "|" + "C" + "|" + "C-" + "|" + "D" + "|" + "D-" + "|" + "E" + "|" + "E-" + "|" + "F" + "|";
    this.lower = "";
    for (let i = 0; i < 11; i++) {
        this.lower += this.gradeLimit[i] + "|";
    }
    console.log('lower is',this.lower);
    // Determine the value of 'internalActive'
    const internalActive = Number(this.data.marksEndSemester) === 0 ? "0" : "1";
    console.log('internalActive is ',internalActive)

    const {pck,entity} =this.dataService.getPckAndEntity()
    this.pck=pck
    this.entity=entity

    let params={
      courseCode:this.courseCode,
      semesterStartDate:this.semesterStartDate,
      semesterEndDate:this.semesterEndDate,
      displayType:this.displayType,
      totalMarks:this.totalMarks,
      marksEndSem:this.marksEndSem,
      sessionStartDate:this.sessionStartDate,
      sessionEndDate:this.sessionEndDate,
      internalActive:internalActive,
      programCourseKey:this.pck,
      lowers:this.lower,
      grades:grades,
      entityId:this.entity

    }
    this.dataService.addGradeLimits(params).subscribe(res => {
        res = JSON.parse(res);
        console.log("Response from API: ", res);
        
    });
}

  onConfirm() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'Confirm-dialog-container';
    dialogConfig.width = "20px";
    dialogConfig.height = "50px";
    dialogConfig.data = { title: "Warning", content: "Please confirm ", ok: true, cancel: true, color: "warn" };
    const dialogRef = this.dialog.open(alertComponent, dialogConfig);

    this.subs.add = dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result === true) {
          this.saveGradeLimit();
      } else {

        return;
      }


    })
    }
  }











