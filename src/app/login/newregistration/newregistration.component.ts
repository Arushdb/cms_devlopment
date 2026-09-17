import { HttpParams } from '@angular/common/http';
import { Component, ElementRef, Inject, OnInit, Renderer2, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { AgGridAngular } from 'ag-grid-angular';
import { GridReadyEvent } from 'ag-grid-community';
import { MyItem } from 'src/app/interfaces/my-item';
import { UserService } from 'src/app/services/user.service';
import { alertComponent } from 'src/app/shared/alert/alert.component';
import { CustomComboboxComponent } from 'src/app/shared/custom-combobox/custom-combobox.component';
import { SubscriptionContainer } from 'src/app/shared/subscription-container';
import {Location} from '@angular/common';
import { FormControl, FormGroup } from '@angular/forms';
import { isUndefined } from 'typescript-collections/dist/lib/util';
import { CourseGroupRelationRule } from 'src/app/interfaces/course-group-relation-rule';
import { GroupCreditRule } from 'src/app/interfaces/group-credit-rule';
import { CourseRuleService } from 'src/app/services/course-rule.service';
import { CourseGroupRowComponent } from 'src/app/shared/course-group-row/course-group-row.component';
@Component({
  selector: 'app-newregistration',
  templateUrl: './newregistration.component.html',
  styleUrls: ['./newregistration.component.css']
})
export class NewregistrationComponent implements OnInit {

  @ViewChild('agGrid') agGrid: AgGridAngular;
  @ViewChild('CustomComboboxComponent') custcombo: CustomComboboxComponent;
  selectionErrorMessage: string = '';
   isSubmitEnabled: boolean = false;
    mask: boolean = false;
    courseGroupRow = CourseGroupRowComponent;
  
  combowidth: string='';
  //public displaybutton: boolean =false;
  //suppressRowDeselection = false;
  check=false;
  subs = new SubscriptionContainer();
  reg_params =new HttpParams();
  program_id: string='';
  branch_code: string='';
  new_specialization: string='';
  semester_code: string='';
  entity_id: string='';
  program_name: string='';
  branch_name: string='';
  new_specialization_description: string='';
  spc_name: string='';
  entity_name: string='';
  _studentdata:any;

  displaystudent=true;
 
  registrationform: FormGroup;
 
  courseobj: {};
  courseary: any;

  courseGroupRules: CourseGroupRelationRule[] = [];
  groupCreditRules: GroupCreditRule[] = [];
  //enrollment_number: string;

  
  //  mode: ProgressSpinnerMode = 'indeterminate';
  // color: ThemePalette = 'primary';
  // value = 50;

  constructor(private router:Router,
    private userservice:UserService,
    private _activatedRoute:ActivatedRoute,
    private elementRef:ElementRef,
    @Inject(MAT_DIALOG_DATA) public data,
    
    
    private location:Location,
    public dialog: MatDialog,
    private renderer:Renderer2,
     private courseRuleService: CourseRuleService,
    private dialogRef: MatDialogRef<NewregistrationComponent>

    ) { 
      
  }
  ngOnDestroy(): void {
    this.subs.dispose();
    this.elementRef.nativeElement.remove();
   
  }
  ngAfterViewInit(): void {
    
  }
  close() {
    this.dialogRef.close(false);
  }

 
  // Onchange(){
  //   console.log(this.check);
  //   this.check?this.agGrid.api.selectAll():this.agGrid.api.deselectAll();
  // }

  OngridReady(parameters:GridReadyEvent){
    //this.agGrid.api.forEachNode((node,index)=>{console.log(node,index)});
//this.agGrid.defaultColDef=this.defaultColDef;

 parameters.api.deselectAll();

    this.check = false;

  //     if(this.mincreditrequired===this.creditavailable)
      
  //     {
  //       parameters.api.selectAll();
      
  //       this.check=true;
  //       //this.suppressRowDeselection=true;

  // }
  }

  ngOnInit(): void {
    this.onContinue();
  }

   maxcredit: any;
   mincredit: any;
  
   crselected: any;
 
  
   semesterStartDate:string='';
   semesterEndDate:string='';
   pck:string='';
   creditavailable:number=0;
   creditselected:number=0;
   credittheory:number=0;
   creditpractical:number=0;
   maxcreditrequired:number=0;
   mincreditrequired:number=0;
   coursecode:string=""; 
   coursename:string=""; 
  spinnerstatus:boolean=false;
  selecteddata:string=""; //added by Jyoti on 6 Aug 2025
  public myrowData:any[]=[];

   selectedNodes:any;
 

  defaultColDef = {
    sortable: true,
    filter: true
       
};
hashValueGetter = (params: any) => {
  if (params.data?.isGroup === true) {
    return '';
  }

  let seqNo = 0;
  let found = false;

  params.api.forEachNodeAfterFilterAndSort((node: any) => {

    if (found) {
      return;
    }

    // Start a new group
    if (node.data?.isGroup === true) {
      seqNo = 0;
      return;
    }

    seqNo++;

    if (node === params.node) {
      found = true;
    }
  });

  return seqNo;
};



columnDefs = [
   {
     headerName: 'Seq No',
     maxWidth: 100,
     valueGetter: this.hashValueGetter,
   },
    {
      field: 'coursetypedesc',
      headerName: 'Course Type',
      hide: true,
    },

    {
      field: 'coursetype',
      hide: true,
    },

    {
      field: 'course_code',
      headerName: 'Course Code',
      checkboxSelection: (params) => {
        return !params.data.isGroup;
      },
    },

    {
      field: 'course_name',
      headerName: 'Course Name',
    },

    {
      field: 'credits',
      headerName: 'Credits',
    },
  ];


   params = new HttpParams()
  .set('application','CMS');

  myparam = new HttpParams()
  .set('application','CMS');
  
  public combodata :MyItem []=[];

 



  
getcoursesservice(){
  
 
   let myparam = {xmltojs:'Y',
   method:'None' }; 
  
    myparam.method='/registrationform/getStudentcourses.htm';
   
    this.spinnerstatus=true;
    this.subs.add= this.userservice.getdata(this.reg_params,myparam).subscribe(res=>{
      this.spinnerstatus=false;
    res = JSON.parse(res);
    this.combodata.splice(0,this.combodata.length);
   
    this.getcoursesSuccess(res );
  
    
  });
 
  


} 

 getcoursesSuccess(res ){

 
  console.log("courses",res);
   let data: any  =res.ElectiveSubjects.elective;
    this.myrowData = this.createGroupedData(data);
    this.getCourseGroupRules(data);

 


  console.log("courses",this.myrowData.length);
	var start:number=0;
	this.pck = "";
	


	for (var obj of  res.ElectiveSubjects.elective){
		
	
	
			 if(start==0){
			 	
		
       this.maxcredit=obj.maximum_credits;
       
			 this.mincredit=obj.minimum_credits;
		
			 this.mincreditrequired =parseFloat(this.mincredit);
			 this.maxcreditrequired =parseFloat(this.maxcredit);

       console.log(this.mincreditrequired,this.maxcreditrequired);
			 
			 
			 this.pck = obj.program_course_key ; 
   
    
       this.creditavailable = parseFloat(obj.credits);
     			 
		start++;
		}else{
      
      this.creditavailable =this.creditavailable + parseFloat(obj.credits);
    }
				}

        console.log("credits available",this.creditavailable);
	}


goBack(): void {
 
  this.displaystudent=true;
}
 submit(){
		
	
  this.credittheory = 0;
  this.creditpractical=0;
  this.creditselected = 0;

 
  const selectedNodes = this.agGrid.api.getSelectedNodes();
  const subjectselected = selectedNodes.map(node => node.data );
 

    if (subjectselected.length==0){
      const dialogRef=  this.dialog.open(alertComponent,
        {data:{title:"Warning",content:"You selected :"+ 0+" credits ." +
        this.mincredit,ok:true,cancel:false,color:"warn"}
    });
    dialogRef.disableClose = true;
     return;
    }
 
      this.courseobj={};
      this.courseary=[];
     this.selecteddata ="";
    //for(var d:number=0;d<subjectselected.length;d++)
    for (var gridItem of subjectselected) 
    {
       
          if(
          (this.creditavailable<=this.mincreditrequired)
          ||
          (subjectselected.length>0)
         
          )
           
            {
            
              this.courseobj={};
            	this.creditselected+=parseFloat(gridItem.credits[0]);
     
                   
             //this.coursecode= this.coursecode+gridItem.course_code[0]+",";
             //this.coursename= this.coursename+gridItem.course_name[0]+",";
            
            
             this.coursecode= gridItem.course_code[0];
             this.coursename= gridItem.course_name[0];
            
            
             this.courseobj['courseCode']=this.coursecode;
            this.courseobj['courseName']=this.coursename;
            this.courseobj['courseGroupCode']=String(this.coursename).slice(0,3);
           

            this.courseary.push(this.courseobj);
            this.selecteddata= this.selecteddata+this.coursecode+",";
            
             if(gridItem.course_classification[0]=="T"){
            		this.credittheory += parseFloat(gridItem.credits[0]);
            	}else{
            		this.creditpractical += parseFloat(gridItem.credits[0]);
            	}
              	  	
            
     }
     
     }
     console.log("after validation");

     this.crselected="Credits Selected:"+this.creditselected;
      
          if(
          (this.creditselected>=this.mincreditrequired)&&(this.creditselected<=this.maxcreditrequired)
                     
           )
           {
            //console.log("pck credits are validated...now validate course type credits.");
            this.validateCourseTypeCredits(); //added by Jyoti on 29 Aug 2026
            	
			
           }
           else
           {
            //const dialogRef =
            console.log("Failure");
            const dialogRef=  this.dialog.open(alertComponent,
              {data:{title:"Warning",content:"You selected :"+ this.creditselected +" credits ." +
              "Please select at least :"+this.mincredit +" and not more than :"+this.maxcredit
              ,ok:true,cancel:false,color:"warn"}
          });
          dialogRef.disableClose = true;
          dialogRef.afterClosed().subscribe(result => {
            console.log(`Dialog result: ${result}`);


            });      

            
           
            return;	
            
           }
           
           
  }

    onOK(){
    
     

     
    
    let  myparam1 = new HttpParams();
     //.set('application','CMS');
      var CurrentDateTime:Date = new Date();

      this.courseary=JSON.stringify(this.courseary);

      myparam1= myparam1.set("application","CMS");
      myparam1=myparam1.set("date",CurrentDateTime.toString());
      myparam1=myparam1.set("course_list",this.coursecode);
      myparam1=myparam1.set("coursename_list",this.coursename);
      myparam1=myparam1.set("coursedata",this.courseary);
     
      
      const RegCredit = new FormControl('');
      const theoryCredit = new FormControl('');
      const pracCredit = new FormControl('');
      const creditExcludeAudit = new FormControl('');
      const rollNumberGroupCode = new FormControl('');
      
     

      this.registrationform.addControl('regCredit',RegCredit);
      this.registrationform.addControl('theoryCredit',theoryCredit);
      this.registrationform.addControl('pracCredit',pracCredit);
      this.registrationform.addControl('creditExcludeAudit',creditExcludeAudit);
      this.registrationform.addControl('rollNumberGroupCode',rollNumberGroupCode);
      

      this.f.regCredit.setValue(this.creditselected);
      this.f.theoryCredit.setValue(this.credittheory);
      this.f.pracCredit.setValue(this.creditpractical);
      this.f.creditExcludeAudit.setValue(this.creditselected);
      this.f.rollNumberGroupCode.setValue("G1");
      
      
      
      
      let formobj =this.registrationform.getRawValue();
      let serializedForm = JSON.stringify(formobj);

     

      myparam1=myparam1.set("registerationform",serializedForm);


    
      
      const dialogConfig = new MatDialogConfig();
      let obj = {xmltojs:'Y',
      method:'/registrationform/registerStudentangular.htm' };   
      //this.mask=true;
      this.spinnerstatus=true;
      this.subs.add= this.userservice.getdata(myparam1,obj).subscribe(res=>{
        this.spinnerstatus=false;
        let resobj:any = JSON.parse(res);
        let message="";
        let title="";
        let matdata={};
        if (!isUndefined(resobj.Details)){
    message ="You are successfully registered";
    title="Success";
    dialogConfig.width="20%";
    dialogConfig.height="20%";
     matdata ={title:title,content:message
      ,ok:true,cancel:false,color:"accent", "success":true}

   }else{
    message =resobj.root.exception[0].exceptionstring[0];
    title="Error in registration";
    dialogConfig.width="40%";
    dialogConfig.height="50%";
    matdata ={title:title,content:message
      ,ok:false,cancel:true,color:"warn","error":true }
   }

       
       // this.mask=false;
       
        //dialogConfig.data=
        
        dialogConfig.data=matdata;
        dialogConfig.backdropClass=['display-after-delay', 'backdrop-background'];
       
        dialogConfig.panelClass='custom-modalbox'

     
         const dialogRef=  this.dialog.open(alertComponent,dialogConfig);
         
         dialogRef.disableClose = true;

      dialogRef.afterClosed().subscribe(result => {
        this.dialogRef.close(false);
        });      
        
        
     
      },error=>{
    
        this.spinnerstatus=false;
        const dialogRef=  this.dialog.open(alertComponent,
          {data:{title:"Warning",content:"Error in Registration,Please try again"
          ,ok:true,cancel:false,color:"warn"},width:"30%",height:"20%"
      });
      dialogRef.disableClose = true;
      dialogRef.afterClosed().subscribe(result => {
        this.dialogRef.close(false);
        });      
        
        this.userservice.log("");
      });
   
      
    }
   
    
    //}
    
    
           
    
     
   


  
  //  OnOptionselected(obj){
  //    if(obj.id==="-1"){
  //     this.displaybutton =false;
  //    }else{
  //     this.displaybutton =true;
  //     this.itemselected=obj; 
  //    }
  //    console.log("on option selected",obj);
  
  //  }
     
  
 
onContinue(){

 
    
    console.log("Arush",this.data);
  
    this._studentdata=this.data.studentdata;
     
    
    
    
     this.program_id=String(this._studentdata.studentdata.student[0].program_id[0]).trim();
     this.branch_code=String(this._studentdata.studentdata.student[0].branch_code[0]).trim();
     this.new_specialization=String(this._studentdata.studentdata.student[0].new_specialization[0]).trim();
     this.semester_code=String(this._studentdata.studentdata.student[0].semester_code[0]).trim();
     this.entity_id=String(this._studentdata.studentdata.student[0].entity_id[0]).trim();
     this.semesterStartDate=String(this._studentdata.studentdata.student[0].semesterStartDate[0]).trim();
     this.semesterEndDate=String(this._studentdata.studentdata.student[0].semesterEndDate[0]).trim();
     this.program_name=String(this._studentdata.studentdata.student[0].program_name[0]).trim();
     this.branch_name=String(this._studentdata.studentdata.student[0].branch_name[0]).trim();
     this.spc_name=String(this._studentdata.studentdata.student[0].new_specialization_description[0]).trim();
     this.entity_name=String(this._studentdata.studentdata.student[0].entity_name[0]).trim();
    
    
       this.reg_params=this.reg_params.set("student_id",String(this._studentdata.studentdata.student[0].student_id[0]).trim());
        this.reg_params=this.reg_params.set("semesterStartDate",String(this._studentdata.studentdata.student[0].session_start_date[0]).trim());
        this.reg_params=this.reg_params.set("semesterEndDate",String(this._studentdata.studentdata.student[0].session_end_date[0]).trim());
        this.reg_params=this.reg_params.set("program_id",this.program_id);
        this.reg_params=this.reg_params.set("branch_code",this.branch_code);
        this.reg_params=this.reg_params.set("new_specialization",this.new_specialization);
        this.reg_params=this.reg_params.set("semester_code",this.semester_code);
        this.reg_params=this.reg_params.set("entity_id",this.entity_id);
      
        console.log(this._studentdata);
        console.log(this.reg_params);

 
 
  this.getcoursesservice();
  
    


   }
get f(){
  return this.registrationform.controls
}

   Onchangedata(registrationform:FormGroup){
     this.registrationform=registrationform;

     
    
     if(this.f.status.value==="valid")
     this.displaystudent=false;
    
     
     
     

   }
      //validateCourseTypeCredits added by Jyoti on 6 Aug 2025
   validateCourseTypeCredits()
    {
      console.log("selCourseData", this.selecteddata, "forpck", this.pck);
      var proceed:boolean = false;
      let myparam = {xmltojs:'Y', method:'None' };  
      myparam.method='/registrationforstudent/checkCourseTypeCredits.htm';
      this.params= this.params.set("selecteddata",this.selecteddata);
      this.params=this.params.set('pck', this.pck);
      //this.mask=true;
      this.subs.add= this.userservice.getdata(this.params,myparam).subscribe(res=>{
         let data = JSON.parse(res);
         let alertmsg = "";
         for (var obj of  data.registerDetails.Detail)
         {
              proceed = false;
              if(obj.available=='N'){
                  //console.log("after validation",obj.message);
                  proceed = true;
                  break;
              }else{
                alertmsg = alertmsg  + "You selected total:<b>" + obj.credits +"</b> credits for " + "<b>" + obj.coursetypedesc + "</b>" +
                       " Please select at least :<b>" + obj.mincredit + "</b><br/>";
              }
          }
          if (!proceed && alertmsg.length > 0) {
              const dialogRef=  this.dialog.open(alertComponent,
                    {data:{title:"Warning",content: alertmsg ,ok:true,cancel:false,color:"warn"}
                    });
                dialogRef.disableClose = true;
          }
          else if (proceed) 
          {this.proceedforSubmission();}
      });
      //this.mask = false;
    }
  
    proceedforSubmission() //added by Jyoti on 29 Aug 2026
    {
          const dialogconf =new MatDialogConfig();
          dialogconf.disableClose=true;
          dialogconf.autoFocus=true;
          dialogconf.width='20%'
          let data={title:"Please confirm",content:"" ,ok:true,cancel:true,color:"warn"};
          dialogconf.data=data;
          const  dialogRef=  this.dialog.open(alertComponent,dialogconf);    
          dialogRef.disableClose = true;
          dialogRef.afterClosed().subscribe(result => {
              console.log(`Dialog result: ${result}`);
              if(result){
                this.onOK();
              }
          });      
    }

     isFullWidthCell = (rowNode: any): boolean => {
    // console.log('FULL WIDTH:', rowNode.data);

    return rowNode.data && rowNode.data.isGroup === true;
  };
  
   createGroupedData(data: any[]): any[] {
    const result: any[] = [];
    let previousType: string = '';

    data.forEach((row) => {
      if (String(row.coursetypedesc).trim() !== previousType) {
        result.push({
          isGroup: true,
          coursetypedesc: row.coursetypedesc + '(' + row.course_type + ')',
        });
          previousType = String(row.coursetypedesc).trim();
      }

      result.push({
        ...row,
        isGroup: false,
        coursetype: row.course_type
      });
    });
    console.log('Grouped Data', result);
    return result;
  }
  getCourseGroupRules(data: any) {
    let myparam = { xmltojs: 'Y', method: 'None' };
    let pck = data[0].program_course_key;
    myparam.method = '/registrationforstudent/checkCourseGroupRules.htm';
    this.params = this.params.set('programCourseKey', pck);
   
    this.mask = true;
    this.subs.add = this.userservice.getdata(this.params, myparam).subscribe(
      (res) => {
        const data = JSON.parse(res);
        console.log('Course Group Rules', data);
        // Credit rules
        this.groupCreditRules = data.groupCreditRules || [];

        // Relationship rules
        this.courseGroupRules = data.groupRelations || [];

        console.log('GROUP CREDIT RULES:', this.groupCreditRules);
    
        this.mask = false;
        //this.getcoursesSuccess(res );
        console.log('Course Group Rules', this.courseGroupRules);
        console.log('Group Credit Rules', this.groupCreditRules);
      },
      (error: any) => {
        console.error('Error getting course group rules', error);
      },
    );
  }
  getRuleForGroup(groupCode: string): CourseGroupRelationRule | null {
    const rule = this.courseGroupRules.find(
      (r) => r.dependent_group_code === groupCode && r.active === 1,
    );

    return rule || null;
  }
  getSelectedCredits(groupCode: string): number {
    let totalCredits = 0;

    this.agGrid.api.forEachNode((node) => {
      if (!node.data || node.data.isGroup) {
        return;
      }

      const group = this.getValue(node.data.coursetype);

      if (node.isSelected() && group === groupCode) {
        totalCredits += this.getCredits(node.data);
      }
    });

    return totalCredits;
  }

  checkDependency(
  node: any,
  rule: CourseGroupRelationRule
): boolean {
   debugger;
  
  const result =
    this.courseRuleService.checkDependency(
      node,
      rule,
      (value: any) => this.getValue(value),
      (groupCode: string) =>
        this.getSelectedCredits(groupCode),
      (groupCode: string, node: any) =>
        this.getSelectedDisciplines(groupCode, node)
    );

  this.selectionErrorMessage =
    result.message;

  return result.valid;
}
 

  getSelectedDisciplines(groupCode: string, excludeNode?: any): string[] {
    const disciplines: string[] = [];


    this.agGrid.api.forEachNode((node: any) => {
      if (!node.data || node.data.isGroup) {
        return;
      }
      console.log(
    'Course:',
    node.data?.coursecode,
    'Selected:',
    node.isSelected(),
    'Data:',
    node.data
  );

      // IMPORTANT:
      // Don't include the course currently being checked
      if (excludeNode && node === excludeNode) {
        return;
      }

      const group = this.getValue(node.data.coursetype);
      console.log(node.isSelected(), group, groupCode, node.data.discipline);
      if (node.isSelected() && group === groupCode) {
        const discipline = this.getValue(node.data.discipline);

        if (discipline && disciplines.indexOf(discipline) === -1) {
          disciplines.push(discipline);
        }
      }
    });

    return disciplines;
  }
onSelectionChanged(event: any) {
  console.log('Selected nodes:', event.api.getSelectedNodes());
  console.log('Selected data:', event.api.getSelectedRows());

  this.isSubmitEnabled = this.checkTotalCreditRules();
  if (this.isSubmitEnabled) {
    this.selectionErrorMessage=""
  }
}


  getCreditRule(groupCode: string): any {
    return this.groupCreditRules.find((r) => r.courseGroupCode === groupCode);
  }

  checkCreditLimit(node: any): boolean {
    console.log('Checking credit limit for node:', node.data);

    const group = this.getValue(node.data.coursetype);

    const rule = this.getCreditRule(group);

    if (!rule) {
      return true;
    }

    let selectedCredits = 0;

    this.agGrid.api.forEachNode((rowNode: any) => {
      if (!rowNode.data || rowNode.data.isGroup) {
        return;
      }

      // Don't count the course we are currently checking
      if (rowNode === node) {
        return;
      }

      if (rowNode.isSelected()) {
        const rowGroup = this.getValue(rowNode.data.coursetype);

        if (rowGroup === group) {
          selectedCredits += this.getCredits(rowNode.data);
        }
      }
    });

    const courseCredits = this.getCredits(node.data);
    
    if (selectedCredits + courseCredits > Number(rule.maximumCredit)) {
      this.selectionErrorMessage =
        'You cannot select more than ' +
        rule.maximumCredit +
        ' credits in the ' +
        group +
        ' group.';

      return false;
    }

    return true;
  }
 
  onRowSelected(event: any): void {
 
    
    console.log('Row selected:', event.node.data);

    // Ignore group rows
    if (!event.node.data || event.node.data.isGroup) {
      return;
    }

    console.log('Selected:', event.node.isSelected());
    
    

    // -----------------------------------------
    // DESELECTION
    // -----------------------------------------
    if (!event.node.isSelected()) {
      // Refresh the grid because the selected
      // discipline/credit situation has changed
      this.agGrid.api.refreshCells({
        force: true,
      });
      
     if(this.isSubmitEnabled){

       this.isSubmitEnabled = this.checkTotalCreditRules();
     }
      return;
    }

    // -----------------------------------------
    // NEW SELECTION
    // -----------------------------------------
    if (!this.canSelectCourse(event.node)) {
      // Undo the selection
      event.node.setSelected(false);

      //alert('Course selection is not allowed by the current rules.');

      return;
    }
    this.isSubmitEnabled = this.checkTotalCreditRules();

    // -----------------------------------------
    // VALID SELECTION
    // -----------------------------------------
    this.agGrid.api.refreshCells({
      force: true,
    });
  }
  canSelectCourse(node: any): boolean {
    debugger;
    if (!node.data || node.data.isGroup) {
      return false;
    }

    const group = this.getValue(node.data.coursetype);

    const rule = this.getRuleForGroup(group);

    // No relationship rule
    if (!rule) {
      return this.checkCreditLimit(node);
    }

    // Dependency
    if (!this.checkDependency(node, rule)) {
      return false;
    }

    // Credit limit
    if (!this.checkCreditLimit(node)) {
      return false;
    }

    return true;
  }

  getValue(value: any): string {
    if (Array.isArray(value)) {
      return value.length > 0 ? value[0] : '';
    }

    return value || '';
  }
  getCredits(row: any): number {
    return parseFloat(this.getValue(row.credits)) || 0;
  }
  checkDisciplineSelection(node: any, rule: CourseGroupRelationRule): boolean {
    // No discipline selection restriction
    if (
      !rule ||
      !rule.discipline_selection ||
      rule.discipline_selection !== 'SINGLE'
    ) {
      return true;
    }

    const currentDiscipline = this.getValue(node.data.discipline);

    const selectedDisciplines = this.getSelectedDisciplines(
      rule.dependent_group_code,
    );

    // No discipline has been selected yet
    if (selectedDisciplines.length === 0) {
      return true;
    }

    // SINGLE means only the already-selected
    // discipline can be selected
    return selectedDisciplines.indexOf(currentDiscipline) !== -1;
  }

  checkTotalCreditRules(): boolean {
    if (!this.groupCreditRules || this.groupCreditRules.length === 0) {
      return false;
    }

    // Check every group rule returned by backend
    for (const rule of this.groupCreditRules) {
      const groupCode = rule.courseGroupCode;

      const selectedCredits = this.getSelectedCredits(groupCode);

      const minimumCredit = Number(rule.minimumCredit);

      const maximumCredit = Number(rule.maximumCredit);

      console.log(
        'Credit Rule:',
        groupCode,
        'Selected:',
        selectedCredits,
        'Min:',
        minimumCredit,
        'Max:',
        maximumCredit,
      );

      // Minimum credit not satisfied
      if (selectedCredits < minimumCredit) {
        this.selectionErrorMessage =
          'You must select at least ' +
          minimumCredit +
          ' credits in the ' +
          groupCode +
          ' group.';
        return false;
      }

      // Maximum credit exceeded
      if (selectedCredits > maximumCredit) {
        this.selectionErrorMessage =
          'You cannot select more than ' +
          maximumCredit +
          ' credits in the ' +
          groupCode +
          ' group.';
        return false;
      }
    }

    return true;
  }


  }