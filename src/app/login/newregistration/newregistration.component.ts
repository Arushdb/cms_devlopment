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
import { FormGroup } from '@angular/forms';
@Component({
  selector: 'app-newregistration',
  templateUrl: './newregistration.component.html',
  styleUrls: ['./newregistration.component.css']
})
export class NewregistrationComponent implements OnInit {

  @ViewChild('agGrid') agGrid: AgGridAngular;
  @ViewChild('CustomComboboxComponent') custcombo: CustomComboboxComponent;
  combowidth: string;
  public displaybutton: boolean =false;
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
  app_number: string;
  registrationform: FormGroup;

  
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

  // OnSelectAll(){
  //   this.agGrid.api.selectAll();
  // }
  Onchange(){
    console.log(this.check);
    this.check?this.agGrid.api.selectAll():this.agGrid.api.deselectAll();
  }

  OngridReady(parameters:GridReadyEvent){
    //this.agGrid.api.forEachNode((node,index)=>{console.log(node,index)});


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
  itemselected:MyItem;
  combolabel:string;
   mask:boolean=false;
   pgm: any;
   branch: any;
   spec: any;
   sem: any;
   maxcredit: any;
   mincredit: any;
   attempt: any;
   crselected: any;
   entity: any;
  
  
    title = 'my-app';
  semDetail:any;
   tencode:any;
   studentDetail:any;
   url:string;
   urlPrefix:string;
  
   programId:string;
   branchId:string;
   specializationId:string;
    entityId:string;
   semester:string;
  
   semesterStartDate:string;
   semesterEndDate:string
   pck:string;
   creditavailable:number;
   creditselected:number;
  
   credittheory:number;
   creditpractical:number;
   maxcreditrequired:number;
   mincreditrequired:number;
   attemptno:number;
   wrkAC:any;
   selectedbranchId:string ;
   selectedspcId:string;

  
    
   
   regdataAC:any ;
   //selecteddata=new Collections.Set<string>();
     selecteddata:string=""; 
   studentdetailAC:any ;

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
    // this.params=this.params.append('switchType','NON');
    // this.params=this.params.append('module','');
    this.mask=true;
    this.subs.add= this.userservice.getdata(this.reg_params,myparam).subscribe(res=>{
  
    res = JSON.parse(res);
    this.combodata.splice(0,this.combodata.length);
    //this.combodata =[];
    this.mask=false;
    this.getcoursesSuccess(res );
  
    
  });
 
  


} 

 getcoursesSuccess(res ){
	//semDetail = event.result as XML;
  //regdataAC = new ArrayCollection();
 
  console.log("courses",res);
  

  this.myrowData=res.ElectiveSubjects.elective;

  console.log("courses",this.myrowData.length);
	var start:number=0;
	
	
	//Alert.show("arush"+semDetail);

	for (var obj of  res.ElectiveSubjects.elective){
		
	
		//	vstack.selectedChild=regpanel;
			//vstack.selectedChild=regpanel;	
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
     return;
    }
  
    //for(var d:number=0;d<subjectselected.length;d++)
    for (var gridItem of subjectselected) 
    {
       
          if(
          (this.creditavailable<=this.mincreditrequired)
          ||
          (subjectselected.length>0)
         
          )
           
            {
            
            	this.creditselected+=parseFloat(gridItem.credits);
            
             this.selecteddata= this.selecteddata+gridItem.courseCode+",";
            	if(gridItem.courseclassification=="T"){
            		this.credittheory += parseFloat(gridItem.credits);
            	}else{
            		this.creditpractical += parseFloat(gridItem.credits);
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
             let data={title:"",content:"Please confirm" ,ok:true,cancel:true,color:"warn"};
             dialogconf.data=data;
           

            const  dialogRef=  this.dialog.open(alertComponent,dialogconf);
              

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

      myparam1= myparam1.append("application","CMS");
      myparam1=myparam1.append("date",CurrentDateTime.toString());
      myparam1=myparam1.append("selecteddata",this.selecteddata);
      myparam1=myparam1.append("semester", this.semester );
      myparam1=myparam1.append("programId",this.programId );
      myparam1=myparam1.append("branchId",this.branchId);
      myparam1=myparam1.append("specializationId",this.specializationId);
      myparam1=myparam1.append("pck",this.pck);
      myparam1=myparam1.append("credits",this.creditselected.toString());
      myparam1=myparam1.append("semesterStartDate",this.semesterStartDate);
      myparam1=myparam1.append("semesterEndDate",this.semesterEndDate);
      myparam1=myparam1.append("attemptno",this.attemptno.toString());
      myparam1=myparam1.append("entityId",this.entityId);
      myparam1=myparam1.append("credittheory",this.credittheory.toString());
      myparam1=myparam1.append("creditpractical",this.creditpractical.toString());

      //myparam1["application"]="CMS";
      //Alert.show("Date :"+CurrentDateTime);
          
    console.log(myparam1);      
         
             
          
              
              
              
        
          //Arush on 27/10/18  If it is a switched student take values from myparam at global level else take from param.
          
          if (this.myparam["switchType"]!=null){
            
            myparam1=myparam1.append("currentpck",this.myparam["currentpck"]);
            myparam1=myparam1.append("switchType",this.myparam["switchType"]);
            myparam1=myparam1.append("switchoption",this.myparam["switchoption"]);

            // myparam1["switchType"]=this.myparam["switchType"];
            // myparam1["switchoption"] = this.myparam["switchoption"] ;
            // myparam1["currentpck"] = this.myparam["currentpck"] ;
        }else{
          myparam1=myparam1.append("switchType", this.params.get("switchType")) ;
          myparam1=myparam1.append("switchoption", this.params.get("switchoption")) ;
          myparam1=myparam1.append("currentpck", this.params.get("currentpck")) 
        }
          
   
        this.urlPrefix = this.url+"registerstudent.htm";
      //Mask.show(commonFunction.getMessages('pleaseWait'));

      let obj = {xmltojs:'Y',
      method:'/registrationforstudent/registerstudent.htm' };   
      this.mask=true;
      this.subs.add= this.userservice.getdata(myparam1,obj).subscribe(res=>{
        //   let data = null;
        //   xml2js.parseString( res, function (err, result){
        //    data = result;
        // });
     
        res = JSON.parse(res);
        this.mask=false;
        this.registerstudentSuccess(res);
        //this.userservice.log(res.registerDetails.Detail.message);
     // console.log("output of registration",res.registerDetails.Detail.message);   
      //registerstudentservice.send(myparam1) ;
      });
   
     // console.log(myparam1);     
    }
   
    
    //}
    
     registerstudentSuccess(res ){
      //Mask.close();
       //semDetail = event.result as XML;
       
       //Alert.show("regstatus:"+semDetail);
       //vstack.selectedChild=errorpanel;
       for (var  obj of  res.registerDetails.Detail ){
         if(obj.available=="err"){
     //errorlabel.text=obj.message;
     this.userservice.log(obj.message);
     this.router.navigate(['../dashboard']); 

         return;
       
 //		Alert.show("Error :"+obj.message);
     
         }
           if(obj.available=="reg"){
            // errorlabel.text ="You are successfully registered";
            this.userservice.log("You are successfully registered");
     
     //vstack.selectedChild=errorpanel;
     this.router.navigate(['../dashboard']);  
     return;	
 //		Alert.show("Error :"+obj.message);
     
         }else{
          this.userservice.log("Error in registration");
             //errorlabel.text ="Error in registration";
             this.router.navigate(['../dashboard']);  
             return;
             
         }
        
         
         
       }
       
       
       //vstack.selectedChild=errorpanel;
       
       //Alert.show("registerstudentsuccess"+semDetail);
     }
     
    
     
   


  
   OnOptionselected(obj){
     if(obj.id==="-1"){
      this.displaybutton =false;
     }else{
      this.displaybutton =true;
      this.itemselected=obj; 
     }
     console.log("on option selected",obj);
  
   }
     
  
 
onContinue(){

  //this._activatedRoute.queryParams.subscribe(params => {
    //console.log(params.menus);
    
    
    console.log("Arush",this.data);
    //let res=JSON.parse(this.data.reg_params);
   // let res=this.data.studentdata;
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

    //this.menus.push(data);
    //let mymenu = params["menu"];
    //this.menus.push(data);
    //console.log(this.menus);
 

  //console.log("on Continue");
 
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
  
  





   
    



