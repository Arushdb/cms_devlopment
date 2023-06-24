import { Component, OnInit, Renderer2, ElementRef, ViewChild } from '@angular/core';
import { CustomComboboxComponent } from '../../shared/custom-combobox/custom-combobox.component';
import { HttpParams } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { SubscriptionContainer } from '../../shared/subscription-container';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { InstructorcourseService } from '../../services/instructorcourse.service';
import { MyItem } from '../../interfaces/my-item';
import { InstructorCourseModel } from '../instructorCourse.model';
import { AgGridAngular } from 'ag-grid-angular';
import { alertComponent } from '../../shared/alert/alert.component';
import { ButtonCellRendererComponent } from '../../shared/button-cell-renderer/button-cell-renderer.component';
import { CoursepcklistComponent } from '../coursepcklist/coursepcklist.component';
import { isNullOrUndefined } from 'util';


@Component({
  selector: 'app-instructorcourse',
  templateUrl: './instructorcourse.component.html',
  styleUrls: ['./instructorcourse.component.css']
})

export class InstructorcourseComponent implements OnInit {
  @ViewChild(CustomComboboxComponent,{static:false}) sessionYearCombo: CustomComboboxComponent;
  @ViewChild('agGrid') agGrid: AgGridAngular;
  mask:boolean = true;
  showSessionCB:boolean = false;
  sessionCombo : MyItem []=[];
  params = new HttpParams().set('application','CMS');
  subs = new SubscriptionContainer();
  instructorCourseform: FormGroup;
  submitted:boolean = false;
  sessioncombolabel: string="";
  combowidth = "80%";
  instCourseList : InstructorCourseModel[]=[];
  showICGrid :boolean = false;
  showAssignbtn:boolean = false;
  defaultColDef :any;
  inpobj: InstructorCourseModel = new InstructorCourseModel();

  columnDefs = [
    { headerName:'Click to',
        cellRendererFramework:ButtonCellRendererComponent,
        cellRendererParams: { onClick: this.onbttnClicked.bind(this), label: 'Unassign'}
    },
    { headerName:'Course Code', field: 'course_code', hide:true }, //,checkboxSelection: true 
    { headerName:'Course Name', field: 'courseName', hide:true},
    { headerName:'Instructor Name', field: 'courseTeacher' },
    { headerName:'Instructor Code', field: 'employee_id' },
    { headerName:'Semester', field: 'semester', hide:true },
    { headerName:'Entity', field: 'entity_name' },
    { headerName:'Program', field: 'program_name' },
    { headerName:'Branch', field: 'branch' },
    { headerName:'Specialization', field: 'specialization' } ,
    { headerName:'programCourseKey', field: 'PCK_ID', hide:true } ,
    { headerName:'semesterStartDate', field: 'semester_start_date' } ,
    { headerName:'semesterEndDate', field: 'semester_end_date' }
   ]; 


  constructor(private formBuilder:FormBuilder,
    private router:Router,
    private instservice:InstructorcourseService,
    private route:ActivatedRoute,
    public dialog: MatDialog,
  private renderer:Renderer2, private elementRef:ElementRef) 
  { 
    this.showICGrid = false;
    this.defaultColDef = { sortable: true, filter: true, resizable: true, suppressSizeToFit:false };
  }
  
  ngOnDestroy(): void {
    this.subs.dispose();
    this.elementRef.nativeElement.remove();
  }
  
  ngOnInit(): void {
    this.instructorCourseform = this.formBuilder.group({
      course_code:['', Validators.compose([Validators.required,Validators.minLength(6)])],
      //sessionYear:['', [Validators.required]],
   }
  );
    this.getSessionList();    
  }
  
  get f() { return this.instructorCourseform.controls; }

  getSessionList():void
	{
		this.mask=true;
		this.subs.add=this.instservice.getSessiondata(this.params).subscribe(res=>{
			res= JSON.parse(res);
			this.sessionResultHandler(res);
			this.mask=false;
			});
  } 
  
  sessionResultHandler(res)
  {
    let semDt: string= "";
    let session: string="";
    for  (var obj of  res.pckList.pck){
      semDt = obj.semDate.toString();
      session = semDt.substring(0,4);
      session = session + '-' + ((Number(session)) + 1);
      this.sessionCombo.push({id:semDt, label:session});
    }
    this.showSessionCB = true;
  }

  sessionChangeHandler(obj)
  {
      this.inpobj.sessionStartDate= obj.id.toString();
      console.log(this.inpobj.sessionStartDate);
  }

  validateCourse()
  {
    this.submitted = true;
    if (this.inpobj.sessionStartDate.length == 0 || this.inpobj.sessionStartDate == "")
    {
      const dialogRef=  this.dialog.open(alertComponent,
        {data:{title:"Information",content:"Please select Session", ok:true,cancel:false,color:"warn"}});
        dialogRef.disableClose = true;
      return;
    }
    this.inpobj.course_code = this.instructorCourseform.get('course_code').value;
    this.inpobj.curDate = new Date;
    //console.log("course_code=", this.inpobj.course_code);
    this.mask=true;
    this.params = this.params.set("time", this.inpobj.curDate.toString()); 
		this.params = this.params.set("courseCode", this.inpobj.course_code);

		/*this.subs.add=this.instservice.checkCourseAccess(this.params).subscribe(res=>{
			res= JSON.parse(res);
			this.courseResultHandler(res);
			this.mask=false;
      }); */
    this.params = this.params.set("StartDate", this.inpobj.sessionStartDate);
        this.subs.add=this.instservice.getAssignedCourseInstructors(this.params).subscribe(res=>{
        res= JSON.parse(res);
        //console.log(res);
			    this.getCourseInstResultHandler(res);
			    this.mask=false;
        });
  }
  
  courseResultHandler(res)
  {
    console.log(res.msglist.msg[0].Message);
    this.inpobj.courseName = res.msglist.msg[0].Message;
    if (this.inpobj.courseName != "N")
    {
        this.mask=true;
        this.params = this.params.set("time", this.inpobj.curDate.toString()); 
		    this.params = this.params.set("courseCode", this.inpobj.course_code);
        this.params = this.params.set("StartDate", this.inpobj.sessionStartDate);
        this.subs.add=this.instservice.getAssignedCourseInstructors(this.params).subscribe(res=>{
        res= JSON.parse(res);
        //console.log(res);
			    this.getCourseInstResultHandler(res);
			    this.mask=false;
        });
    }
    else {
      const dialogRef=  this.dialog.open(alertComponent,
        {data:{title:"Information",content:"Access not available. Please enter another course code", ok:true,cancel:false,color:"warn"}});
      dialogRef.disableClose = true;
    }
  } 
  
  onbttnClicked(e) {
    let sel = e.rowData; 
    const dialogRef=  this.dialog.open(alertComponent,
      {data:{title:"Warning",content:"Are you sure to unassign course " + sel.course_code + " from Instructor " + sel.courseTeacher + " ?", ok:true,cancel:true,color:"warn"}});
      dialogRef.disableClose = true;
    dialogRef.afterClosed().subscribe(result => {
        console.log(`Dialog result: ${result}`);
        if(result){
          this.unassignConfirmed(sel) ;       
        }
    });
  }

  unassignConfirmed(sel: InstructorCourseModel)
  {
      this.params = this.params.set("courseCode", sel.course_code + "|");
      this.params = this.params.set("pck", sel.PCK_ID + "|");
      this.params = this.params.set("empId", sel.employee_id + "|");
      this.params = this.params.set("entity", sel.entity_id + "|");
      this.params = this.params.set("programId", sel.program_id + "|");
      this.params = this.params.set("semester_start_date", sel.semester_start_date + "|");
      this.params = this.params.set("semester_end_date",  sel.semester_end_date + "|");
      this.subs.add=this.instservice.unassignInstructor(this.params).subscribe(
        res=>{
          //console.log(res);
          let alertdialog=  this.dialog.open(alertComponent,
            {data:{title:"Information",content:"Selected Instructor has been unassigned successfully", ok:true,cancel:false,color:"warn"}});
            alertdialog.disableClose = true;            
          }
          
      );  
      this.validateCourse();
  }
  
  getCourseInstResultHandler(res)
  {
    this.instCourseList = res.pckList.pck;
    this.showAssignbtn = true;
    if(isNullOrUndefined(this.instCourseList))
         { this.showICGrid = false;   }
    else { this.showICGrid = true; }
  }
  
  OnICGridReady($event){
    this.agGrid.columnApi.autoSizeAllColumns(true);
    this.agGrid
  }
  
  onAssign()
  {
      //console.log(this.inpobj);
      const dialogRef=  this.dialog.open(CoursepcklistComponent, 
        {data:{title:"Program List",content:this.inpobj, ok:true,cancel:false,color:"warn"},
        width:"100%",height:"70%"
      });
      dialogRef.disableClose = true;            
      dialogRef.afterClosed().subscribe(res => {
        this.instservice.clear();
        //console.log("after close", res);
        this.validateCourse();
      });
  }
  
  onRowSelected(event){
    this.instservice.clear();
   }

  onBack(){
    //this.location.back();
    this.elementRef.nativeElement.remove();
  }

}
