import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AngularFrameworkComponentWrapper, ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams, IAfterGuiAttachedParams, ColDef } from 'ag-grid-community';
import { SchoolStudentDetailComponent } from 'src/app/student/school-student-detail/school-student-detail.component';

@Component({
  selector: 'app-custom-button',
  templateUrl: './custom-button.component.html',
  styleUrls: ['./custom-button.component.css']
})
export class CustomButtonComponent implements ICellRendererAngularComp {

  
  label:string;

  constructor(private dialog:MatDialog) { }

  agInit(params: ICellRendererParams): void {
    //this.label=params.getValue
  
   this.label= params.colDef.cellRendererParams;
  //console.log(params.colDef.cellRendererParams);
   }
  refresh(params: ICellRendererParams) {
  
    return true;
  }

  onClick(e){
   console.log(e);
    this.dialog.open(SchoolStudentDetailComponent);
  }
  
}
