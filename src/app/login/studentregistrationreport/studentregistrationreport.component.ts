import { Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, RequiredValidator, Validators } from '@angular/forms';
import { debounce } from 'rxjs/operators';


import {Location} from '@angular/common';
import { SubscriptionContainer } from '../../shared/subscription-container';
import { ActivatedRoute, Router } from '@angular/router';
import {FlleserviceService} from '../../services/flleservice.service'
import { HttpParams } from '@angular/common/http';
import { isUndefined } from 'typescript-collections/dist/lib/util';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { UserService } from '../../services/user.service';

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
  generateAdmitCard:string = "REG"; //added by Jyoti on 7 Sep 2024
  headerName:string = "Download Registration Report"; //added by Jyoti on 7 Sep 2024

  constructor(
    private formBuilder: FormBuilder,
    private elementRef:ElementRef,
    private location:Location,
    private route: ActivatedRoute,
    private router: Router,
    private fileservice:FlleserviceService,
    private userservice:UserService
    )
     {
      

     }
   
   phoneNumkeyPress(event: any) {
      const pattern = /[0-9\+\-\ ]/;
      let inputChar = String.fromCharCode(event.charCode);
      if (event.keyCode != 8 && !pattern.test(inputChar)) {
        event.preventDefault();
      }
    }

  ngOnInit(): void {
    this.generateAdmitCard = "";
    this.route.params.subscribe(params => { this.generateAdmitCard = params['id']} ) ;
    console.log("generateAdmitCard-", this.generateAdmitCard, "-");
    if (this.generateAdmitCard == 'ADM')
    {
        this.headerName = "Download Admit Card";
        this.selectedRadio='dob';
    }
    else if (this.generateAdmitCard == 'REG')
    {
        this.headerName = "Download Registration Report";
    }
    this.registerationReportForm = this.formBuilder.group({
      registrationNumber:["",Validators.compose([Validators.required,Validators.minLength(6)])],
      
      aadhaarNumber:[""],
    
      pdf:["",[Validators.required]],
      contactNumber:['',[ Validators.required,
        Validators.pattern("^[0-9]*$")]],
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

     //console.log("contactnumber", this.f.contactNumber.value);
     if (this.selectedRadio=="aadhar"){
       
       this.f.dateOfBirth.setErrors(null);
       this.f.contactNumber.setErrors(null);
     }
    //console.log(this.registerationReportForm);
     if (this.selectedRadio=="dob"){
       
       this.f.aadhaarNumber.setErrors(null);
       if (this.generateAdmitCard == 'ADM'){ //added by Jyoti on 7 Sep 2024
        this.f.contactNumber.setErrors(null);
       }
     }

    if (this.registerationReportForm.invalid && this.f.registrationNumber.errors != null) {
        console.log("form invalid");
     //console.log(this.f.registrationNumber.errors.minlength.requiredLength);
        return; 
    }
   // alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.registerationReportForm.value, null, 4));
    let params:HttpParams= new HttpParams();
    params=params.set("aadhaarNumber",this.f.aadhaarNumber.value)
                  .set("registrationNumber",this.f.registrationNumber.value)
                  .set("contactNumber",this.f.contactNumber.value)
                  .set("dob",this.f.dateOfBirth.value)
                  .set("generateAdmitCard", this.generateAdmitCard)
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
      if (this.myfilename==="NRF.pdf" || this.myfilename==="NRECORD.pdf"){
        this.userservice.log("No record found with the given details");
        this.f.pdf.reset();
        return;

      }
      else if (this.myfilename == "NOREG.pdf") {
        this.userservice.log("Student not registered with the given details");
        this.f.pdf.reset();
        return;
      }
      else if (this.myfilename == "NOFEE.pdf") {
        this.userservice.log("No Fee record found with the given details");
        this.f.pdf.reset();
        return;
      }
      else if (this.myfilename == "NOSCH.pdf") {
        this.userservice.log("Admit Card not available");
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