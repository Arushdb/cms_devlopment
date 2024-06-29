//  Author :Piyush Singh
//   Date Created: 14 june 2024
//   Function : Ts file for course evaluation Component (Dialog open on select template button)

import { UserService } from 'src/app/services/user.service';
import { Component, Inject, OnInit , OnDestroy, ElementRef} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA,MatDialog ,MatDialogConfig} from '@angular/material/dialog';
import { GridApi } from 'ag-grid-community';
import { CourseevaluationService } from 'src/app/services/courseevaluation.service';
import { alertComponent } from 'src/app/shared/alert/alert.component';
import { SubscriptionContainer } from 'src/app/shared/subscription-container';
import { MessageService } from 'src/app/services/message.service';

@Component({
  selector: 'app-template',
  templateUrl: './template.component.html',
  styleUrls: ['./template.component.css'],
})
export class TemplateComponent implements OnInit ,OnDestroy{
  [x: string]: any;
  
  gridApi: GridApi;
  templateNames: string[] = [];
  selectedItem: any;
  assignRowData = [];
  assignColumnDefs: any;
  selectedCourse: string = '';
  url: string;
  coursecode: any;
  programid: any;
  semestercode: any;
  templateMaxMarks:number;
  courseMaxMarks: number;
  subs = new SubscriptionContainer();
  spinnerStatus: boolean=false;
  errorMessage: string ;
// dataForReload:any[]=[];

  constructor(
    public dialogRef: MatDialogRef<TemplateComponent>,
    private dialog:MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private courseevaluationService: CourseevaluationService,
    private messagesrv:MessageService,
    private userservice: UserService,
    private elementRef:ElementRef,)
    
     {if (data && data.selectedRowData) {                            //for importing coursecode,programid,semestercode
      const selectedRowData = data.selectedRowData;
      this.coursecode = selectedRowData.coursecode;
      this.programid = selectedRowData.programid;
      this.semestercode = selectedRowData.semestercode;
      // this.dataForReload.push(selectedRowData);
            }

  }

  ngOnInit(): void {
    this.subs.add =this.courseevaluationService.getTemplateNames().subscribe(res => {
      if(res.length===0){
        console.log("error found")
        this.errorMessage= "Error in Template.xml File.";
       }
      this.templateNames = res;
    });
    this.assignColumnDefs = [
      { headerName: 'Component Name', field: 'compName',width:150 },
      { headerName: 'Component Full Name', field: 'fullName' },
      { headerName: 'Group', field: 'group' ,width:100},
      { headerName: 'Maximum Marks', field: 'maxMarks',},
      { headerName: 'Rule', field: 'rule' ,width:90},  
    ];
    this.checkMaxMarks() ;           //getting maximum marks for coursecode
  }

  // Update the rowData for ag-Grid based on the selected template
  onItemSelected(value: string) {
    this.subs.add =this.courseevaluationService.getCourseTemplate(value).subscribe(res => {
      this.selectedItem = res;                           // For displaying the selectin template data in rowdata
      this.assignRowData = res.components;               
      this.templateMaxMarks = parseInt(res.total);           //storing xml total marks in array from xml
        this.spinnerstatus = false;
      }); 
     }

// course maxmarks for selected course and storing it in array
  checkMaxMarks(){    
    this.spinnerStatus=true;                       
    let param={
      coursecode:this.coursecode,
    }
    this.subs.add =this.courseevaluationService.getMaxMarks(param).subscribe((res:any) =>{
      res=JSON.parse(res);
        let array = res.ceclist.rec;
        this.courseMaxMarks = parseInt(array[0].maximummark[0]);
        // console.log('API response',this.courseMaxMarks);
        });
      this.spinnerStatus=false;
  }



  
  //courseMaxMarks --Selectedcourse Total marks    templateMaxMarks --selected template from xml Total marks
  
  //function for assigning data button
  assignTemplate(){
    
    // console.log("course : ",this.courseMaxMarks,'template : ',this.templateMaxMarks)
    this.spinnerStatus=true;
    if(this.courseMaxMarks === this.templateMaxMarks){
      this.getTemplateUpdate()
        this.spinnerStatus=true;
    } else {
        console.log('course max marks:',this.courseMaxMarks,'assigning template total:',this.templateMaxMarks);
        this.spinnerStatus = false;
        // Show a message dialog using MatDialog
    const dialogConfig = new MatDialogConfig();
  dialogConfig.width = "50%";
  dialogConfig.height = "35%";
  const dialogRef = this.dialog.open(alertComponent,
    {
      data: { title: "Warning",
         content: "Maximum marks of Course and Template selected are not equal.Therefore, assigning template is not executed. ", 
         ok:true,  color: "warn" },
      width: "10%", height: "10%"
    });

        }
    }
    
// Template assigning
getTemplateUpdate() {
let param = {
  coursecode: this.coursecode,
  programid: this.programid,
  semestercode: this.semestercode,
  group: this.assignRowData.map(component => component.group).join('|'),
  compName: this.assignRowData.map(component => component.compName).join('|'),
  fullName: this.assignRowData.map(component => component.fullName).join('|'),
  numberOfComponents: this.assignRowData.map(component => component.numberOfComponents.toString()).join('|'),
  maxMarks: this.assignRowData.map(component => component.maxMarks.toString()).join('|'),
  weightage: this.assignRowData.map(component => component.weightage.toString()).join('|'),
  rule: this.assignRowData.map(component => component.rule.toString()).join('|'),
  componentType: this.assignRowData.map(component => component.componentType !== null ? component.componentType.toString():'null').join('|'),
};

this.subs.add =this.courseevaluationService.getTemplateUpdate(param).subscribe(( (isSuccess: boolean) => {
  if (isSuccess) {
    const result = { success: true, data: param };
    this.dialogRef.close(result);
    this.spinnerStatus=false
    // console.log('API response is true');
    } else {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.width = "50%";
      dialogConfig.height = "35%";
      const dialogRef = this.dialog.open(alertComponent,
        {
          data: { title: "ERROR",
             content: "Selected course has been already evaluated.It cannot assigned a new template. ", 
              ok:true, color: "warn" },
          width: "10%", height: "10%"
        });
      this.spinnerStatus=false
    // console.log('API response is false');
  }
})),
(error) => {
  console.error('Error checking API response:', error);
}
}

ngOnDestroy(): void {
  this.subs.dispose();
  this.elementRef.nativeElement.remove();
}

  closeDialog(result?: any): void {
    this.dialogRef.close(result);
  
}

  onGridReady(params: any): void {
    this.gridApi = params.api;
    // this.gridApi.sizeColumnsToFit();
  }
}




