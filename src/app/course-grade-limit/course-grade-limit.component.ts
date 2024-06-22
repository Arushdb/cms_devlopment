import { HttpHeaders, HttpParams } from '@angular/common/http';
import { Component, ComponentFactoryResolver, ElementRef, OnDestroy, OnInit, Input, Renderer2, ViewChild, ɵConsole, EventEmitter, Output } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute, NavigationEnd, Router, UrlSegment } from '@angular/router';
import { CellEditingStoppedEvent, CellFocusedEvent, CellMouseOutEvent, ColDefUtil, ColGroupDef,ColDef, GridOptions, GridReadyEvent, RowDoubleClickedEvent, StartEditingCellParams, ValueSetterParams } from 'ag-grid-community';
import { UserService } from 'src/app/services/user.service';
import { Location } from '@angular/common';
import { ContentChild, AfterContentInit } from '@angular/core';
import { MessageService } from 'src/app/services/message.service'
import { isUndefined } from 'typescript-collections/dist/lib/util';

//import { NumeriCellRendererComponent } from '../numeri-cell-renderer/numeri-cell-renderer.component';
import { CellChangedEvent } from 'ag-grid-community/dist/lib/entities/rowNode';

import { GriddialogComponent } from 'src/app/shared/griddialog/griddialog.component';

import { alertComponent } from 'src/app/shared/alert/alert.component'

import { SubscriptionContainer } from 'src/app/shared/subscription-container';
import { AgGridAngular } from 'ag-grid-angular';
import { Observable, Subject } from 'rxjs';
import { PopupService } from '../popup/popup.service';
import { PopupComponent } from '../popup/popup.component';
import { DataServiceService } from '../data-service.service';
import { DashboardComponent } from '../menu/dashboard/dashboard.component';
import { catchError, map } from 'rxjs/operators';
import { CourseListItem } from 'src/app/interfaces/data'


@Component({
  selector: 'app-course-grade-limit',
  templateUrl: './course-grade-limit.component.html',
  styleUrls: ['./course-grade-limit.component.css']
})
export class CourseGradeLimitComponent implements OnInit {
  dialog: any;
  @Output() dataRecieved = new EventEmitter<any>();

  param = new HttpParams()
    .set('application', 'CMS');

  awardsheet_params: HttpParams = new HttpParams();
  CourseListItemAry: CourseListItem[];
  displaySecondaryGrid = false;
  gradeLimitData: CourseListItem[];
  rowData: any[] = [];
  displayType: any;
  subs = new SubscriptionContainer();
  setGradeLimit:boolean;
  private pck: string;
  private entity: string;
  public secondaryColumnDefs:ColDef[]


  styleCourse: { width: string; height: string; flex: string; };
  gridOptions: GridOptions;
  public courseListGrid = [];
  spinnerstatus: boolean = false;
  mydefaultColDef: {
    editable: true,
    sortable: true,
    flex: 1,
    minWidth: 50,
    filter: true,
    resizable: true,
    courseType: any,
    gridOptionsmk: GridOptions,

  };
  defaultColDef = {
    resizable: true,
    sortable: true,
    filter: true

  };

  columnDefs = [
    { field: "Subject", checkboxSelection: true },
    { field: "Name" },
    { field: "Faculty" },
    { field: "Program" },
    { field: "Branch" },
    { field: "Spec" },
    { field: "Sem_Date" },


  ];
  courseType: any;
  urlPrefix: string;
  courseCode: any;
  semesterStartDate: any;
  semesterEndDate: any;
  totalMarks: any;
  marksEndSem: any;
  sessionStartDate: any;
  sessionEndDate: any;
  submitForApprovalButton:boolean=false;
  public saveButton:boolean=false;
  gradelimitButton:boolean=false;
  public editgrid:boolean=true;
  instructorCount:string="" ;
  
  private gradeauthorityholder:boolean=false;
  submitstatusofotherteacher="";

  constructor(
    private router:Router,
    private messageService: MessageService,
    private popupService: PopupService,
    private dataService: DataServiceService,
    private _Activatedroute: ActivatedRoute,
    private location:Location
  ) {
    this.courseListGrid = [];
    const gradecolwidth = 70;
    this.secondaryColumnDefs = [
      {
        headerName: "Subject",
        field: 'courseCode',
        maxWidth: 100,
        pinned: "left"
      },
  
      {
        headerName: "Faculity",
        field: 'ownerEntityName',
        maxWidth: 250,
        pinned: "left"
      },
  
  
      {
        headerName: "Program",
        field: 'ownerProgramName',
        maxWidth: 250,
      },
  
      {
        headerName: "Branch",
        field: 'ownerBranchName',
        maxWidth: 120,
      },
      {
        headerName: "Specialization",
        field: 'ownerSpecializationName',
        maxWidth: 120,
      },
      {
        headerName: "Sem",
        field: 'semester',
        maxWidth: 50,
      },
      {
        headerName: "A",
        field: 'lowerA',
        maxWidth: gradecolwidth,
      },
      {
        headerName: "A-",
        field: 'lowerAM',
        maxWidth: gradecolwidth,
      },
      {
        headerName: "B",
        field: 'lowerB',
        maxWidth: gradecolwidth
      },
      {
        headerName: "B-",
        field: 'lowerBM',
        maxWidth: gradecolwidth
      },
      {
        headerName: "C",
        field: 'lowerC',
        maxWidth: gradecolwidth
      },
      {
        headerName: "C-",
        field: 'lowerCM',
        maxWidth: gradecolwidth
      },
      {
        headerName: "D",
        field: 'lowerD',
        maxWidth: gradecolwidth
      },
  
      {
        headerName: "D-",
        field: 'lowerDM',
        maxWidth: gradecolwidth
      },
  
      {
        headerName: "E",
        field: 'lowerE',
        maxWidth: gradecolwidth
      },
  
      {
        headerName: "E-",
        field: 'lowerEM',
        maxWidth: gradecolwidth
      },
  
      {
        headerName: "F",
        field: 'lowerF',
        maxWidth: gradecolwidth
      },
      {
        headerName: "Result Status",
        field: 'userId',
        maxWidth: 150
      },
      {
        headerName: "AwardSheetStatus",
        field: 'status',
        maxWidth: 150,
        pinned: "right"
      },
  
    ];
    this.subs.add =this.router.events.subscribe((evt) => {
      if (evt instanceof NavigationEnd) {
     //   console.log(evt);
        // this.gridOptionsmk.api.destroy();
        // this.gridOptions.api.destroy();
        this.rowData=[];
        this.ngOnInit();

        
      }
  });




  }
  
  ngOnInit(): void {
    this.subs.add = this._Activatedroute.data.subscribe(data => {
      this.spinnerstatus = false;

      // Setting Display type and Course type
      this.displayType = data.displayType;
      this.courseType = data.courseType;

      this.urlPrefix = "/awardsheet/";
      this.param = this.param.set('displayType', this.displayType);
      this.fetchCourseList()
    });
  }

  backClicked(): void {
    this.location.back();
  }

  closeDialog(): void {
    this.popupService.closeDialog();
  }
  openPopup() {
    if (this.gradeLimitData && this.gradeLimitData.length > 0) {
      const subject = this.gradeLimitData[0].courseCode;
      this.popupService.openPopup(subject);
    }

  }

  setoffButton(){
      
    this.submitForApprovalButton=false;
    this.gradelimitButton=false;
    this.editgrid=false;
    this.saveButton=false;
    this.spinnerstatus=false;
  }

  fetchCourseList(): void {
    let obj = {
      xmltojs: 'Y',
      method: 'None'
    };
    obj.method = '/awardsheet/getCourseList.htm';
    this.spinnerstatus = true;
    console.log("getCourseList outer", this.spinnerstatus);

    this.param = this.param.set('displayType', "I");
    this.dataService.fetchData(this.param, obj).subscribe(
      (res: any) => {
        res = JSON.parse(res);
        if (isUndefined(res.CodeList.root)){
          this.setoffButton();
          this.dataService.log("No Subject Assigned");
          //this.goBack();
    
          return;
        }
        else{
        console.log("Type of res:", typeof res);
        let courseListArray: any[] = [];

        try {

          // Log the parsed response to understand its structure
          console.log("Parsed API Response", res);

          // Check if res contains CodeList and inspect its structure
          if (res && res.CodeList) {
            console.log("CodeList found in response:", res.CodeList);
            this.spinnerstatus = false

            // If CodeList contains an array, extract it
            courseListArray = res.CodeList.root;
            // Transform the response to match the desired fields
            courseListArray = courseListArray.map(item => {
              return {
                Subject: item.courseCode[0],
                Name: item.courseName[0],
                Faculty: item.entityName[0],
                Program: item.programName[0],
                Branch: item.branchName[0],
                Spec: item.specializationName[0],
                Sem_Date: item.semesterStartDate[0],
                _hidden: {
                  courseCode: item.courseCode[0],
                  semesterStartDate: item.semesterStartDate[0],
                  semesterEndDate: item.semesterEndDate[0],
                  totalMarks: '200',
                  marksEndSem: '50', 
                  sessionStartDate: item.startDate[0],
                  sessionEndDate: item.endDate[0],
                  programCourseKey:item.programCourseKey[0],
                  entityId:item.entityId[0]

                }
              };
            });

            console.log("Transformed Row Data", courseListArray);
            this.rowData = courseListArray;
          } else {
            // Log the structure of res if it is not in the expected format
            console.error("Unexpected API response structure:", res);
            return; // Exit if the structure is unexpected
          }
        } catch (e) {
          console.error("Failed to parse API response", e);
        }
      }
      (error) => {
        console.error('Error fetching data', error);
      }
    }
    );
  
  }
  onSelectionChanged(event: any): void {
    if (event.api.getSelectedRows().length > 0) {
      console.log("Aditya",event.api.getSelectedRows().length)
      const selectedRow = event.api.getSelectedRows()[0];
      this.getGradeLimit(selectedRow);
      this.spinnerstatus = true;
    }
    else {
      this.displaySecondaryGrid = false;
    }

  }

  getGradeLimit(selectedRow: any): void {
    const params = {
      courseCode: selectedRow._hidden.courseCode,
      semesterStartDate: selectedRow._hidden.semesterStartDate,
      semesterEndDate: selectedRow._hidden.semesterEndDate,
      displayType: 'I',
      totalMarks: selectedRow._hidden.totalMarks,
      marksEndSem: selectedRow._hidden.marksEndSem,
      sessionStartDate: selectedRow._hidden.sessionStartDate,
      sessionEndDate: selectedRow._hidden.sessionEndDate,
      programCourseKey:selectedRow._hidden.programCourseKey,
      entityId:selectedRow._hidden.entityId
    };
    this.dataService.setParams(params);


    this.dataService.setAwardSheet(params).subscribe(
      res => {
        res = JSON.parse(res)
        console.log('Data received from setAwardSheet:', res);
        this.spinnerstatus = false;
        if(isUndefined(res.courseDetails)){
          this.displaySecondaryGrid=false;  
          this.dataService.log("No Student found");
          this.setoffButton();
          
          return;
        }
        else{
        this.displaySecondaryGrid=true;
        this.pck = "";
        this.entity = "";

        // this.CourseListItemAry=response;
        this.gradeLimitData = res.courseDetails.Details;

        this.gradeLimitData.forEach(item => {
          this.pck += item.programCourseKey + "|";
          this.entity += item.ownerEntityId + "|";
    
        }
      );
        // programme course key and entity share.
        this.dataService.setPckAndEntity(this.pck,this.entity);

        console.log("Data put in courseListItemAry", this.gradeLimitData);
        if(this.gradeLimitData[0]['userId'][0]==='Not Declared'){
        this.setGradeLimit=true;
        this.dataRecieved.emit(res);
        }
        else{
          this.setGradeLimit=false;
        }



      }
      (error) => {
        console.error('Error fetching data from dataService', error);

        }
      }
    );
  }




  OnCoursegridReady($event) {
    this.styleCourse = {
      width: '100%',
      height: '30%',
      flex: '1 1 auto'
    };
  }

}
