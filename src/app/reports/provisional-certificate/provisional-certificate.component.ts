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
  combowidth:string; 
  pcfilepath:String="";
  selectedOption: string = '';
  showDropdown: boolean = false;
  selectedExitYear: string = '';
  exitYear: string[] = ['1', '2', '3', '4'];

  constructor(private fb: FormBuilder, private router: Router,
        private fileservice:FlleserviceService,
        private programService:ProgramService,
        private userservice:UserService ) 
  {
    this.proviform = this.fb.group({
      option: ['', [Validators.required]],
      selNepExitYear: [''],
      rollno: [null, [Validators.required]],
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
  
  onOptionChange() {
    this.proviform.get('rollno')?.setValue("");
    this.proviform.get('selNepExitYear')?.setValue("");
    this.programdata =[];
    this.showProgramList= false;
    this.pcfilepath = "";
  }

  onyrChange() {
    this.programdata =[];
    this.showProgramList= false;
    this.pcfilepath = "";
  }

  getProgram(){
    this.pcfilepath = "";
    this.inp_rollno = this.proviform.value.rollno;
    this.selectedOption = this.proviform.value.option;
    if ( this.selectedOption == "NEP"){
          this.selectedExitYear = this.proviform.value.selNepExitYear;
    }
    else { 
      this.selectedExitYear = "";
    }
    console.log("inp roll no", this.inp_rollno, " selectionOption", this.selectedOption,"exityr ", this.selectedExitYear);
    this.programdata =[];
    this.showProgramList= false;
    this.programService.getStudentExitProgram(this.inp_rollno, this.selectedOption, this.selectedExitYear).subscribe(res=>{
      let  data = JSON.parse(res); console.log("data", data, data.programList.program);
          if(isUndefined(data.programList.program) || data === null){
              this.programService.log("No Data found");
              return;
            }
            
          data.programList.program.forEach(ob => {        
            this.programdata.push({id:ob.programID,label:ob.programName,status:ob.statusInProgram});
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
    this.prgId=obj.id[0];
    this.pgmName=obj.label[0];
    console.log("obj", obj);
  }

  onSubmit(){
      if (this.proviform.status!="VALID"){
        this.userservice.log("Input not Valid");
      return;
    }
    this.pcfilepath = "";
    let params:HttpParams= new HttpParams();
    params=params.set("rollNumber", this.inp_rollno.trim())
                  .set("programID", this.prgId.trim())
                  .set("prgOption", this.selectedOption)
                  .set("exitYear", this.selectedExitYear)
                 ;
    let  myparam:any={};
    myparam.xmltojs="Y"  ;          
    this.fileservice.getProviCertiFileName(params,myparam).subscribe(res=>{
     let resobj = JSON.parse(res);
     if(!(isUndefined(resobj.info.result)) && resobj.info.result[0].status == "success"){
      let url1:String = resobj.info.result[0].pathWithFileName;
		  let aa:any[] = url1.toString().split('\\');
			url1 = aa.join('\/');
      if (url1.length > 0) {
        this.pcfilepath = url1;
       }  
     }
    },error=>{
      this.userservice.log(error.originalError.statusText);
    });
    
  }

}
