import { Component, OnInit, ViewChild, Inject, ElementRef } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { ButtonCellRendererComponent } from '../../shared/button-cell-renderer/button-cell-renderer.component';
import { InstructorCourseModel } from '../instructorCourse.model';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { InstructorcourseService } from '../../services/instructorcourse.service';
import { HttpParams } from '@angular/common/http';
import { SubscriptionContainer } from '../../shared/subscription-container';
import { InstructorlistComponent } from '../instructorlist/instructorlist.component';
import { alertComponent } from '../../shared/alert/alert.component';

@Component({
  selector: 'app-coursepcklist',
  templateUrl: './coursepcklist.component.html',
  styleUrls: ['./coursepcklist.component.css']
})

export class CoursepcklistComponent implements OnInit {
  @ViewChild('agGrid') agGrid: AgGridAngular;
  pckList : InstructorCourseModel[]=[];
  inpobj: InstructorCourseModel = this.data.content;
  showPckGrid :boolean = false;
  defaultColDef :any;
  spinnerstatus: boolean=false;
  params = new HttpParams().set('application','CMS');
  
  columnDefs = [
    { headerName:'Course Code', field: 'course_code', hide:true },
    { headerName:'Course Name', field: 'courseName', hide:true},
    { headerName:'Instructor Name', field: 'courseTeacher', hide:true },
    { headerName:'Instructor Code', field: 'employee_id', hide:true },
    { headerName:'Entity', field: 'entity_name' },
    { headerName:'Program', field: 'program_name',checkboxSelection: true, headerCheckboxSelection:true  },
    { headerName:'Branch', field: 'branch' },
    { headerName:'Specialization', field: 'specialization' } ,
    { headerName:'Semester', field: 'semester', },
    { headerName:'programCourseKey', field: 'PCK_ID', hide:true } ,
    { headerName:'semesterStartDate', field: 'semester_start_date' } ,
    { headerName:'semesterEndDate', field: 'semester_end_date' },
   ]; 

  subs = new SubscriptionContainer();
  
  constructor(
    private dialogRef: MatDialogRef<CoursepcklistComponent> ,
    @Inject(MAT_DIALOG_DATA) public data,
    private instservice:InstructorcourseService,
    public mdialog: MatDialog, private elementRef:ElementRef
    ) 
  {
    this.showPckGrid = false;
    this.defaultColDef = { sortable: true, filter: true, resizable: true, suppressSizeToFit:false };
  }

    
  ngOnDestroy(): void {
    this.subs.dispose();
    this.elementRef.nativeElement.remove();
  }

  ngOnInit(): void {
      //console.log(this.inpobj, this.inpobj.course_code);
      this.inpobj.curDate = new Date;
        this.params = this.params.set("time", this.inpobj.curDate.toString()); 
		    this.params = this.params.set("courseCode", this.inpobj.course_code);
        this.params = this.params.set("semdate", this.inpobj.sessionStartDate);
        //console.log(this.sessionDate);
		    this.subs.add=this.instservice.getCoursePckList(this.params).subscribe(res=>{
			  res= JSON.parse(res);
			    this.getpcklistResultHandler(res);
        });
  }

  getpcklistResultHandler(res)
  {
      //console.log(res);
      this.pckList = res.pckList.pck;
      this.showPckGrid = true;
  }

  OnGridReady($event){
    this.agGrid.columnApi.autoSizeAllColumns(false);
    this.agGrid
  }
  
  onRowSelected($event){
    this.instservice.clear();
    let gridData = this.agGrid.api.getSelectedNodes();
    let selectedGridItem = gridData.map(node => node.data );
    //console.log(selectedGridItem);
  }
  
  onAssignInstructor()
  {
    let gridData = this.agGrid.api.getSelectedNodes();
    let selectedGridItem = gridData.map(node => node.data );
    if(selectedGridItem.length > 0)
    {
        //console.log(this.inpobj);
        const dialogRef=  this.mdialog.open(InstructorlistComponent, 
          {data:{title:"Instructor List",content:selectedGridItem, ok:true,cancel:false,color:"warn"},
          width:"100%",height:"70%"
        });
        dialogRef.disableClose = true;
        dialogRef.afterClosed().subscribe(res => {
          this.instservice.clear();
         // console.log("after close", res);
        });
    }
    else{
      let dialogRef=  this.mdialog.open(alertComponent,
        {data:{title:"Information",content:"Please select program(s)", ok:true,cancel:false,color:"warn"}});
        dialogRef.disableClose = true;
      return;
    }
  }

  onBackClose(){
    this.dialogRef.close(true);
  }
}

