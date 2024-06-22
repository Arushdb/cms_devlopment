///  Author :Piyush Singh
//   Date Created:14 jun 2024
//   Function : Ts file for course evaluation Component

import { Component, OnInit,ElementRef, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TemplateComponent } from './template/template.component';
import { CourseevaluationService } from '../services/courseevaluation.service';
import { Courseevaluation,Template } from 'src/app/courseevaluation/courseevaluation';
import { Location } from '@angular/common';
import { UserService } from 'src/app/services/user.service';
import { isUndefined } from 'typescript-collections/dist/lib/util';
import { NavigationEnd, Router } from '@angular/router';
import { SubscriptionContainer } from '../shared/subscription-container';

@Component({
  selector: 'app-courseevaluation',
  templateUrl: './courseevaluation.component.html',
  styleUrls: ['./courseevaluation.component.css'],
})
export class CourseevaluationComponent implements OnInit ,OnDestroy{
  selectedCourse: string = '';
  coursecode: any;
  programid: any;
  semestercode: any;
  programCourseColumnDefs: any[];
  programCourseRowData: Courseevaluation[] = []; // interface courseevaluation --courseevaluation
  templateColumnDefs: any[];
  templateRowData: Template[] = []; // interface template --courseevaluation
  gridApi: any;
  userId: string;
  universityId: string;
  showDetails = false;
  defaultColDef = {
    resizable: false,
    sortable: true,
    filter: true,
  };
  selectedRowData: any;
  spinnerstatus: boolean = false;
  selectedNodes: any[] = [];
  subs = new SubscriptionContainer();
  constructor(
    public dialog: MatDialog,
    private userservice: UserService,
    private courseevaluationService: CourseevaluationService,
    private location: Location,
    private router: Router,
    private elementRef:ElementRef,

  ) { // for re-navigating
    this.subs.add = this.router.events.subscribe((evt) => {
      if (evt instanceof NavigationEnd) {
        this.showDetails = false;
        this.selectedCourse = '';
        this.ngOnInit();
      }
    });
  }
  ngOnInit(): void {
    this.getCourses(); // to get assigned courses
    this.programCourseColumnDefs = [
      {headerName: '',field: 'checkbox',checkboxSelection: true,pinned: true,width: 20,},
      { headerName: 'Program', field: 'programname' },
      { headerName: 'Branch', field: 'branchdescription' },
      { headerName: 'Specialization', field: 'specializationdescription' },
      { headerName: 'Semester', field: 'semestercode' },
      { headerName: 'Course', field: 'coursecode' },
    ];

    this.templateColumnDefs = [
      { headerName: 'Component Name', field: 'evaluationIdName' },
      { headerName: 'Short Name', field: 'groupid', width: 150 },
      { headerName: 'Rule', field: 'ruleName', width: 100 },
      { headerName: 'Maximum Marks', field: 'maximummark' },
      { headerName: 'Total Component', field: 'numberOfComponents' },
      { headerName: 'Order in Marksheet', field: 'orderinmarksheet' },
    ];

  }

  ngOnDestroy(): void {
    this.subs.dispose();
    this.elementRef.nativeElement.remove();
  }

  // Get all courses assigned to teacher from server using api(service)
  getCourses() {
    this.spinnerstatus = true;
    this.courseevaluationService.getProgramCourses().subscribe(
        (res) => {
                res = JSON.parse(res);
            
            if (isUndefined(res.programCourselist.rec)) {
                this.userservice.log("No Subject Assigned");
                this.goBack();
                this.spinnerstatus=false;
                } else {
                  this.programCourseRowData = res.programCourselist.rec;
                  this.spinnerstatus=false;
            }
        })
      }

goBack():void{
  this.location.back();
}
  // passing params on rowselected for getting template
  onRowSelected(event: any): void {
    this.selectedRowData = event.api.getSelectedRows()[0];
    const selectedData = event.data;
    if (selectedData) {
      this.coursecode = selectedData.coursecode;
      this.programid = selectedData.programid;
      this.semestercode = selectedData.semestercode;
      // console.log('Selected Data:', selectedData);     
      }
      const selectedRows = this.gridApi.getSelectedRows();
      if (selectedRows && selectedRows.length > 0) {
        this.showDetails=true;                             // show grid data
        this.selectedCourse = selectedRows[0].coursecode; //for enabling select template button
    this.cecListForTemplate();
      }else {
        this.templateRowData = [];
        this.selectedCourse = '';
        this.showDetails = false;
        }
      }

  // get template assigned to the courses using api by sending params

  cecListForTemplate() {
    this.spinnerstatus=true;
    let params = {
      coursecode: this.coursecode,
      programid: this.programid,
      semestercode: this.semestercode,
    };

    this.courseevaluationService.getCecListForTemplate(params).subscribe(
      (res: any) => {
        res = JSON.parse(res);
          this.spinnerstatus=false;
        this.templateRowData = res.ceclist.rec;
      });
          
          }
          
          // this.templateRowData = res.ceclist.rec;

  onGridReady(params: any) {
    this.gridApi = params.api;
    // this.gridApi.sizeColumnsToFit();
    
  }

  // cancel button function
  hideList(): void {
    this.showDetails = !this.showDetails;
    const selectedNodes = this.gridApi.getSelectedNodes();
    selectedNodes.forEach((node) => node.setSelected(false));
  }


  // function for opening of dialog box for templates
  openDialog(): void {
    
    const dialogRef = this.dialog.open(TemplateComponent, {
      width:'60%',
      data: { selectedRowData: this.selectedRowData }, // to pass the selected coursecode,programid,semestercode for assigning template,,
      })
      dialogRef.afterClosed().subscribe(result => {
        // console.log('Dialog closed with result:', JSON.stringify(result));
       this.recheckNode();                   
      });
    }

    //recheck the selected node
    recheckNode() {
      if(this.gridApi && this.selectedRowData){
            this.gridApi.forEachNode(node => {
           if (node.data === this.selectedRowData){ 
             node.setSelected(false);
              node.setSelected(true);
            }
          })
        };
      }
      
    

    // button function for removing the component menu
  closePage() {
    this.location.back()
  }
  }
