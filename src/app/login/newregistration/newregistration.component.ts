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
@Component({
  selector: 'app-newregistration',
  templateUrl: './newregistration.component.html',
  styleUrls: ['./newregistration.component.css']
})
export class NewregistrationComponent implements OnInit {

  @ViewChild('agGrid') agGrid: AgGridAngular;
  @ViewChild('CustomComboboxComponent') custcombo: CustomComboboxComponent;
  combowidth: string;
  //public displaybutton: boolean =false;
  //suppressRowDeselection = false;
  check=false;
  subs = new SubscriptionContainer();
  reg_params =new HttpParams();
  program_id: string;
  branch_code: string;
  new_specialization: string;
  semester_code: string;
  entity_id: string;
  program_name: string;
  branch_name: string;
  new_specialization_description: string;
  spc_name: string;
  entity_name: string;
  _studentdata:any;

  displaystudent=true;
 
  registrationform: FormGroup;
 
  courseobj: {};
  courseary: any;
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

 
  Onchange(){
    console.log(this.check);
    this.check?this.agGrid.api.selectAll():this.agGrid.api.deselectAll();
  }

  OngridReady(parameters:GridReadyEvent){
    //this.agGrid.api.forEachNode((node,index)=>{console.log(node,index)});
this.agGrid.defaultColDef=this.defaultColDef;

      if(this.mincreditrequired===this.creditavailable)
      
      {
        parameters.api.selectAll();
      
        this.check=true;
        //this.suppressRowDeselection=true;

  }
  }

  ngOnInit(): void {
    this.onContinue();
  }

   maxcredit: any;
   mincredit: any;
  
   crselected: any;
 
  
   semesterStartDate:string;
   semesterEndDate:string
   pck:string;
   creditavailable:number;
   creditselected:number;
   credittheory:number;
   creditpractical:number;
   maxcreditrequired:number;
   mincreditrequired:number;
   coursecode:string=""; 
   coursename:string=""; 
  spinnerstatus:boolean=false;

  public myrowData=[];

   selectedNodes:any;
 

  defaultColDef = {
    sortable: true,
    filter: true
       
};
hashValueGetter = function (params) {
  return params.node.rowIndex;
};

columnDefs = [
 
  {
    headerName: 'Seq No',
    maxWidth: 100,
    valueGetter: this.hashValueGetter,
  },
  { field: 'course_type' },
  { field: 'course_code',checkboxSelection: true  },
  { field: 'course_name' },
  { field: 'credits' },
 
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
  

  this.myrowData=res.ElectiveSubjects.elective;

  console.log("courses",this.myrowData.length);
	var start:number=0;
	
	


	for (var obj of  res.ElectiveSubjects.elective){
		
	
	
			 if(start==0){
			 	
		
       this.maxcredit=obj.maximum_credits;
       
			 this.mincredit=obj.minimum_credits;
		
			 this.mincreditrequired =parseFloat(this.mincredit);
			 this.maxcreditrequired =parseFloat(this.maxcredit);

       console.log(this.mincreditrequired,this.maxcreditrequired);
			 
			 
			 this.pck = obj.programcoursekey ;
				 
   
    
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

            
             if(gridItem.course_classification[0]=="T"){
            		this.credittheory += parseFloat(gridItem.credits[0]);
            	}else{
            		this.creditpractical += parseFloat(gridItem.credits[0]);
            	}
              	  	
            
     }
     
     }
     
     this.crselected="Credits Selected:"+this.creditselected;
      
          if(
          (this.creditselected>=this.mincreditrequired)&&(this.creditselected<=this.maxcreditrequired)
                     
           )
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

            
            // Alert.show(("You selected :"+ creditselected +" credits ." +"Please select at least :"+semestermincredit),
            // (commonFunction.getMessages('error')),0,null,null,errorIcon);
           
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

      //   const dialogRef=  this.dialog.open(alertComponent,
      //     {data:{title:"Success",content:"You are successfully registered"
      //     ,ok:true,cancel:false,color:"accent" },width:"30%",height:"20%"
      // });
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

  }
  
  





   
    



