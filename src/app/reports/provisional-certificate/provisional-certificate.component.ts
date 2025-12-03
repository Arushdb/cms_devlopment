import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { SubscriptionContainer } from 'src/app/shared/subscription-container';
import { HttpParams } from '@angular/common/http';
import { FlleserviceService } from '../../services/flleservice.service';
import { ProgramService } from '../../services/program.service';
import { UserService } from '../../services/user.service';
import { MyItem } from 'src/app/interfaces/my-item';
import { isUndefined } from 'typescript-collections/dist/lib/util';
import { MatDialog } from '@angular/material/dialog';
import {alertComponent} from  'src/app/shared/alert/alert.component';

function customComboValidator(obj): ValidatorFn {
  return (control: AbstractControl): { [key: string]: boolean } | null => {
        if(control.value==' '){ return {'id':true}; }
    return null;
  };
}

@Component({
  selector: 'app-provisional-certificate',
  templateUrl: './provisional-certificate.component.html',
  styleUrls: ['./provisional-certificate.component.css']
})
export class ProvisionalCertificateComponent implements OnInit,OnDestroy {
  route:string;
  subs = new SubscriptionContainer();
  mycolor='blue';
  proviform:FormGroup;
  inp_rollno:string="";
  showProgramList:boolean = false;
  programcombolabel: string;
  public programdata :MyItem []=[];
  prgId: any;
  pgmName: any;
  nepId: any;
  combowidth:string; 
  pcfilepath:String="";
  showDropdown: boolean = false;
  selectedExitYear: string = '';
  spstatus:string='';
  showExitYear:boolean = false ;

  constructor(private fb: FormBuilder, private router: Router,
        private fileservice:FlleserviceService,
        private programService:ProgramService,
        private userservice:UserService,
        public dialog: MatDialog ) 
  {
    this.proviform = this.fb.group({
      rollno: ["", [Validators.required]],
      programId: [" ", [Validators.required,customComboValidator(this.prgId)]]
    });
    this.programcombolabel = "Select Program" ;
    this.combowidth = "100%";
    this.pcfilepath = "";
  }
 
  @HostListener('unloaded')
  ngOnDestroy(): void {
    this.subs.dispose();
  }

  ngOnInit(): void {
    let idx=String(this.router.url).lastIndexOf("/");
     this.route = String(this.router.url).slice(idx+1);
  }

  onCancel(){
    this.router.navigate(['dashboard']);
  }
  
  getProgram(){
    this.userservice.clear();
    this.pcfilepath = "";
    this.inp_rollno = this.proviform.value.rollno;
  //  console.log("inp roll no", this.inp_rollno); 
    this.programdata =[];
    this.showProgramList= false;
    this.showExitYear = false;
    this.programService.getStudentExitProgram(this.inp_rollno).subscribe(res=>{  
      let  data = JSON.parse(res); console.log("data", data, data.programList.program);
          if(isUndefined(data.programList.program) || data === null){
              this.programService.log("No Data found with required PAS semesters");
              return;
            }
            
          data.programList.program.forEach(ob => {        
            this.programdata.push({id:ob.programID,label:ob.programName,status:ob.statusInProgram, exitYear:ob.exitYear, nepId:ob.nepId});
            });     
           if(this.programdata.length >0)
           {
              this.showProgramList= true;
           }
          },
          error=>{    
              this.programService.log(error.originalError.message);
            })
  }

  Onpgmselected(obj){ 
    this.proviform.get('programId')?.setValue(obj.id[0]);
    this.selectedExitYear = obj.exitYear[0];
    this.nepId = obj.nepId[0];
    this.prgId=obj.id[0];
    this.pgmName=obj.label[0];
    this.spstatus=obj.status[0];
    if(this.spstatus === 'ACT' && this.nepId.length > 0 )
    {
      this.showExitYear = true;
    }
    else { this.showExitYear = false; }
  }

  onSubmit(){
      if (this.proviform.status!="VALID"){
        this.userservice.log("Input not Valid");
      return;
    }
    var alertmsg:string="Are you sure to generate Provisional";
    if(this.spstatus === 'ACT' && this.nepId.length > 0 )
    {
      alertmsg = alertmsg + " with student exit year " + this.selectedExitYear + " ?";
    }
    const dialogRef=  this.dialog.open(alertComponent,
              { data:{title:"Warning",content:alertmsg, ok:true,cancel:true,color:"warn"}});
    dialogRef.disableClose = true;
    dialogRef.afterClosed().subscribe(result => {
                  if(result){ 
                      this.generateProviCertificate();
                  }
              }, err => {
                    this.userservice.log("Problem in generating");
              });
  }


  generateProviCertificate()
  {
    this.pcfilepath = "";
    let params:HttpParams= new HttpParams();
    params=params.set("rollNumber", this.inp_rollno.trim())
                  .set("programID", this.prgId.trim())
                  .set("exitYear", this.selectedExitYear)
                  .set("nepId", this.nepId)
                 ;
    let  myparam:any={};
    myparam.xmltojs="Y"  ;          
    this.fileservice.getProviCertiFileName(params,myparam).subscribe(res=>{
     let resobj = JSON.parse(res);
     if(!(isUndefined(resobj.info.result))){
      if (resobj.info.result[0].status == "success") {
        let url1:String = resobj.info.result[0].pathWithFileName;
		    let aa:any[] = url1.toString().split('\\');
			  url1 = aa.join('\/');
        if (url1.length > 0) {
          this.pcfilepath = url1;
        }  
       }
       else {
          this.userservice.log(resobj.info.result[0].message);
       }
     }
     
    },error=>{
      this.userservice.log(error.originalError.statusText);
    });
    
  }

}
