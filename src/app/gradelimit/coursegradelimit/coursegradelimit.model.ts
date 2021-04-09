import { HttpParams } from '@angular/common/http';
import { Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute, NavigationEnd, Router, UrlSegment } from '@angular/router';
import {   ColDef, GridOptions, GridReadyEvent, ValueSetterParams } from 'ag-grid-community';
export class coursegradelimitmodel {

  data ={
    columnDefs: ColDef[]=null,
  
    param = new HttpParams()
    .set('application','CMS'),
  
    displayType:any,
    awardsheet_params=new HttpParams(),
    gridOptions: GridOptions;
    
   
    public defaultColDef;
    
    LoggedInUser: string;
    public courseListGrid=[];
    gradelimitdetail: boolean;
    
    
    style: { width: string; height: string; flex: string; };
   
    
   
   
    employeeCode: any;
  
   
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


  }

}