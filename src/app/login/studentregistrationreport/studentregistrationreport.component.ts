import { Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, RequiredValidator, Validators } from '@angular/forms';
import { debounce } from 'rxjs/operators';


import {Location} from '@angular/common';
import { SubscriptionContainer } from 'src/app/shared/subscription-container';
import { Router } from '@angular/router';
import {FlleserviceService} from 'src/app/services/flleservice.service'
import { HttpParams } from '@angular/common/http';
import { isUndefined } from 'typescript-collections/dist/lib/util';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { UserService } from 'src/app/services/user.service';

export function onlyDigits(formControl: FormControl): {[key: string]: boolean} {
  const DIGIT_EXPS = /^\d*$/;
  //debugger;
  if (!formControl.value.match(DIGIT_EXPS)) {

    return {'NaN': true}
  } 
}

@Component({
  selector: 'app-studentregistrationreport',
  templateUrl: './studentregistrationreport.component.html',
  styleUrls: ['./studentregistrationreport.component.css']
})
export class StudentregistrationreportComponent implements OnInit,OnDestroy {

  registerationReportForm:FormGroup;
 
  option="";
  submitted=false;
  spinnerstatus=false;
  selectedRadio="";
  subs = new SubscriptionContainer();
  myurl: any;
  myfilename: string;
  id1:any;


  constructor(
    private formBuilder: FormBuilder,
    private elementRef:ElementRef,
    private location:Location,
    private router: Router,
    private fileservice:FlleserviceService,
    private userservice:UserService
    )
     {
      

     }
   
   

  ngOnInit(): void {

    this.registerationReportForm = this.formBuilder.group({
      registrationNumber:["",Validators.compose([Validators.required,Validators.minLength(10)])],
      
      aadhaarNumber:[""],
    
      pdf:["",[Validators.required]],
      contactNumber:[''],
      //dateOfBirth: ['1990-01-01']
      dateOfBirth: ['0000-00-00']

    });
    this.myurl='';
  
  }

  public get f() {
          

    return this.registerationReportForm.controls; }

    



    

    onSubmit(){
      this.submitted=true;
      this.myurl='';


     if (this.selectedRadio=="aadhar"){
       
       this.f.dateOfBirth.setErrors(null);
       this.f.contactNumber.setErrors(null);
     }
    //console.log(this.registerationReportForm);
     if (this.selectedRadio=="dob"){
       
       this.f.aadhaarNumber.setErrors(null);
      
     }
    //console.log(this.registerationReportForm);

      if (this.registerationReportForm.invalid) {
       // console.log(this.f.registrationNumber.errors);
     //console.log(this.f.registrationNumber.errors.minlength.requiredLength);
        return;
    }
   // alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.registerationReportForm.value, null, 4));
    let params:HttpParams= new HttpParams();
    params=params.set("aadhaarNumber",this.f.aadhaarNumber.value)
                  .set("registrationNumber",this.f.registrationNumber.value)
                  .set("contactNumber",this.f.contactNumber.value)
                  .set("dob",this.f.dateOfBirth.value)
                 ;
               let  myparam:any={};
                    myparam.xmltojs="Y"  ;          
    this.fileservice.getFileName(params,myparam).subscribe(res=>{
     
     let resobj = JSON.parse(res);

     
     if(!(isUndefined(resobj.info.result))){
      let str =resobj.info.result[0].message[0];
      //this.myfilename=this.f.registrationNumber.value;
      //debugger;
       let strary = String(str).split('/');
      
       this.myfilename =strary[strary.length-1];
      if (this.myfilename==="NRF.pdf"){
        this.userservice.log("No record found with the given details");
        this.f.pdf.reset();
        return;

      }
      this.userservice.log("File has been generated successfully.Please click on above link to download file");    
      this.myurl=str;     
      this.f.pdf.reset();
     
      
     }

 
      

    },error=>{
      //debugger;
      this.userservice.log(error.originalError.statusText);
    });
    
  
    }


    

    onCancel(){
      this.elementRef.nativeElement.remove();
     this.location.back();
   
      this.location.replaceState('/');
      this.router.navigate(['login']);

    }  
    ngOnDestroy(): void {
      this.subs.dispose();
      this.elementRef.nativeElement.remove();
  
     
    }
    onChange(){
      this.f.aadhaarNumber.clearValidators();
      this.f.dateOfBirth.clearValidators();
      this.myurl="";

     
      if(this.selectedRadio=='aadhar'){
        this.f.aadhaarNumber.setValidators([Validators.required,Validators.minLength(12)]) ;
       
      }
      if(this.selectedRadio=='dob'){
        this.f.contactNumber.setValidators([Validators.required]) ;
        this.f.dateOfBirth.setValidators([Validators.required, Validators.pattern(/^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/)]) ;
        
      }

    }

}
