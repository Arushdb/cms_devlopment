import { Component, OnInit, ViewChild, Inject, ElementRef } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { ButtonCellRendererComponent } from '../../shared/button-cell-renderer/button-cell-renderer.component';
import { InstructorCourseModel } from '../instructorCourse.model';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { InstructorcourseService } from '../../services/instructorcourse.service';
import { SubscriptionContainer } from '../../shared/subscription-container';
import { HttpParams } from '@angular/common/http';
import { alertComponent } from '../../shared/alert/alert.component';
import { isNullOrUndefined } from 'util';

@Component({
  selector: 'app-instructorlist',
  templateUrl: './instructorlist.component.html',
  styleUrls: ['./instructorlist.component.css']
})
export class InstructorlistComponent implements OnInit {
  @ViewChild('agGrid') agGrid: AgGridAngular;
  instructorList : InstructorCourseModel[]=[];
  pckobj: InstructorCourseModel[] = this.data.content;
  showInsGrid :boolean = false;
  defaultColDef :any;
  spinnerstatus: boolean=false;
  curDate= new Date;
 
   columnDefs = [
    { headerName:'Course Code', field: 'course_code', hide:true },
    { headerName:'Course Name', field: 'courseName', hide:true},
    { headerName:'Instructor Name', field: 'courseTeacher',checkboxSelection: true  },
    { headerName:'Instructor Code', field: 'employee_code'},
    { headerName:'Email Id', field: 'primary_email_id' },
    { headerName:'Entity', field: 'entity_name', hide:true },
    { headerName:'Program', field: 'program_name', hide:true },
    { headerName:'Branch', field: 'branch', hide:true },
    { headerName:'Specialization', field: 'specialization', hide:true } ,
    { headerName:'Semester', field: 'semester',  hide:true},
    { headerName:'programCourseKey', field: 'PCK_ID', hide:true } ,
    { headerName:'semesterStartDate', field: 'semester_start_date', hide:true } ,
    { headerName:'semesterEndDate', field: 'semester_end_date', hide:true },
   ];
   subs = new SubscriptionContainer();
   params = new HttpParams().set('application','CMS');
  
  constructor(
    private dialogRef: MatDialogRef<InstructorlistComponent> ,
    @Inject(MAT_DIALOG_DATA) public data,
    private instservice:InstructorcourseService,
    public mdialog: MatDialog, private elementRef:ElementRef
    ) 
  {
    this.showInsGrid = false;
    this.defaultColDef = { sortable: true, filter: true, resizable: true, suppressSizeToFit:false };
  }
    
  ngOnDestroy(): void {
    this.subs.dispose();
    this.elementRef.nativeElement.remove();
  }

  ngOnInit(): void {
    //console.log("in instructor list component pck(s)", this.pckobj);
    this.curDate = new Date;
    this.params = this.params.set("time", this.curDate.toString()); 
    this.subs.add=this.instservice.getInstructorsToAssign(this.params).subscribe(res=>{
      res = JSON.parse(res);
      this.getInstlistResultHandler(res);
      });
  
  }
 
  getInstlistResultHandler(res)
  {
      this.instructorList = res.pckList.pck;
      this.showInsGrid = true;
  }

  OnGridReady($event){
    this.agGrid.columnApi.autoSizeAllColumns(false);
    this.agGrid;
  }

  onRowSelected($event){
    this.instservice.clear();
    //let gridData = this.agGrid.api.getSelectedNodes();
    //let selectedGridItem = gridData.map(node => node.data );
  }
  
  onAssignCoursetoInst()
  {
    let gridData = this.agGrid.api.getSelectedNodes();
    let selectedRowInst = gridData.map(node => node.data );
    if(selectedRowInst.length == 1)
    {
      let dialogRef=  this.mdialog.open(alertComponent,
      {data:{title:"Information",content:"Are you sure you want to assign this course!", ok:true,cancel:true,color:"warn"}});
      dialogRef.disableClose = true;
      dialogRef.afterClosed().subscribe(result => {
                // console.log(`Dialog result: ${result}`);
                if(result){
                this.assignConfirmed(selectedRowInst);
                } 
                });      
    }
    else if ( selectedRowInst.length < 1 )
    {
      let dialogRef=  this.mdialog.open(alertComponent,
        {data:{title:"Information",content:"Please select instructor", ok:true,cancel:false,color:"warn"}});  
        dialogRef.disableClose = true;
    }
    return;
  }

  assignConfirmed(selectedRowInst)
  {
    this.params = this.params.set("time", this.curDate.toString()); 
    this.params = this.params.set("program_id", this.pckobj[0].program_id);
    this.params = this.params.set("semester", this.pckobj[0].semester);
    this.params = this.params.set("StartDate", this.pckobj[0].semester_start_date);
    this.params = this.params.set("EndDate", this.pckobj[0].semester_end_date);
    this.params = this.params.set("courseCode", this.pckobj[0].course_code);
    this.params = this.params.set("Flag","SingleCourse"); //SingleCourse or F   
    this.params = this.params.set("employee_id", selectedRowInst[0].employee_id);
    this.params = this.params.set("employee_code", selectedRowInst[0].employee_code);
    this.params = this.params.set("firstApporver",selectedRowInst[0].employee_code);
    let pck:string="";
    let entityId:string="";
	  for(var i:number=0;i<this.pckobj.length;i++)
	  {
          pck=pck+this.pckobj[i].PCK_ID+"|";
		      entityId=entityId+this.pckobj[i].entity_id+"|";
    }
    //console.log("pck:", pck,"entityid:", entityId);
    this.params = this.params.set("pck",pck);
    this.params = this.params.set("entityID",entityId);
    this.subs.add=this.instservice.assignCourseInstructor(this.params).subscribe(res=>{
        res = JSON.parse(res);
        this.onSuccessResultHandler(res);
        },
        err=>{
          this.instservice.log("There is some error." + err.originalError.statusText);
          this.subs.dispose();
          return;
          }  );  
            	
  }

  onSuccessResultHandler(res)
  {
    let str:string=res.msglist.msg[0].Message;
    if(!isNullOrUndefined(str) && str == "RecordPresent")
    {
      str = "This course code is already assigned to the instructor";
    }
    else
    {
      str = "Course has been assigned to Instructor";
    }
    let dialogRef=  this.mdialog.open(alertComponent,
      {data:{title:"Information",content:str, ok:true,cancel:false,color:"warn"}});
      dialogRef.disableClose = true;
    this.onBackClose();
  }

  onBackClose(){
    this.dialogRef.close(true);
  }
}

