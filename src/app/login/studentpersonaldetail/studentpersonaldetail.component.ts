import { HttpParams } from '@angular/common/http';
//import { isNull } from '@angular/compiler/src/output/output_ast';
import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { SubscriptionContainer } from 'src/app/shared/subscription-container';
import {Location} from '@angular/common';
import { UploadfileComponent } from 'src/app/shared/uploadfile/uploadfile.component';

import { MustMatch } from 'src/app/shared/_helpers/must-match.validator';
import { isUndefined } from 'typescript-collections/dist/lib/util';
import { MatDialogRef } from '@angular/material/dialog';



function onlyDigits(formControl: FormControl): {[key: string]: boolean} {
  const DIGIT_EXPS = /^\d*$/;
  
  if (!formControl.value.match(DIGIT_EXPS)) {

    return {'NaN': true}
  } 
}


@Component({
  selector: 'studentpersonaldetail',
  templateUrl: './studentpersonaldetail.component.html',
  styleUrls: ['./studentpersonaldetail.component.css']
})
export class StudentpersonaldetailComponent implements OnInit,OnDestroy {

    @Input() studentdata :any;
    @Output() changedata= new EventEmitter<FormGroup>();
   // @ViewChild('upfile') upfile: UploadfileComponent;

    //fileerror:boolean;
    
    subs = new SubscriptionContainer();

     not_edit_firstname :Boolean;
     not_edit_fathername :Boolean;
     not_edit_mothername :Boolean;
     not_edit_dob :Boolean;
     not_edit_gender :Boolean;
     not_edit_category :Boolean;
     not_edit_email :Boolean;
     not_edit_religion :Boolean;
     not_edit_address :Boolean;
     not_edit_phone :Boolean;
     not_edit_adhnum :Boolean;

     not_edit_firstname_hindi :Boolean;
     not_edit_fathername_hindi :Boolean;
     not_edit_mothername_hindi :Boolean;

     fileToUpload: File = null;
     upload=true;
    
   
    // subs = new SubscriptionContainer();

  registerForm: FormGroup;
    submitted = false;
    
     
    firstname: string;
    fathername: string;
    mothername: string;
    dob: string;
    gender: string;
    category: string;
    email: string;
    religion: string;
    address: string;
    phone: string;
    adhnum: string;
    admissionMode: string;
    appnumber: any;
  spinnerstatus: boolean;
  option: string;
  enrolvalid: boolean;
  enrvaild: boolean;
  filests: any;
  filename: string;
 

    constructor(private formBuilder: FormBuilder, 
      private router: Router,
      private userservice:UserService,
      private elementRef:ElementRef,
      private location:Location,
      private dialogRef: MatDialogRef<StudentpersonaldetailComponent>) {

        
     }
  ngOnDestroy(): void {
    this.subs.dispose();
    this.elementRef.nativeElement.remove();

   
  }

    ngOnInit() {
        this.registerForm = this.formBuilder.group({
            //title: ['', Validators.required],
            appnumber: [''],
            firstname: ['', Validators.required],
            fathername: ['', Validators.required],
            mothername: ['', Validators.required],
           
            gender: ['', Validators.required],
            category: ['', Validators.required],
           
            religion: ['', Validators.required],
            phyhand: ['', Validators.required],
            minority: ['', Validators.required],
            address: ['', Validators.required],
            phone: ['', Validators.required],
            adhnum: ['', Validators.required],
          
            enrolmentnumber: [''],
            lastdegree: ['', Validators.required],

            firstnamehindi: ['', Validators.required],
            fathernamehindi: ['', Validators.required],
            mothernamehindi: ['', Validators.required],
         
            dob: ['', [Validators.required, Validators.pattern(/^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/)]],
            email: ['', [Validators.required, Validators.email]],
            status:['']
            
        }
      
        );
        this.option="-1";
        
        console.log("Arush",this.studentdata);
        this.firstname=String(this.studentdata.studentdata.student[0].first_name[0]).trim();
        this.fathername=String(this.studentdata.studentdata.student[0].father_name[0]).trim();
        this.mothername=String(this.studentdata.studentdata.student[0].motherFirstName[0]).trim();
        this.dob=String(this.studentdata.studentdata.student[0].date_of_birth[0]).trim();
        this.gender=String(this.studentdata.studentdata.student[0].gender[0]).trim();
        this.category=String(this.studentdata.studentdata.student[0].category[0]).trim();
        this.email=String(this.studentdata.studentdata.student[0].primary_email_id[0]).trim();
        this.religion=String(this.studentdata.studentdata.student[0].religion[0]).trim();
        
        this.address=String(this.studentdata.studentdata.student[0].address[0]).trim();
        this.phone=String(this.studentdata.studentdata.student[0].homePhone[0]).trim();
        this.adhnum=String(this.studentdata.studentdata.student[0].aadhaarNumber[0]).trim();
        this.admissionMode=String(this.studentdata.studentdata.student[0].admissionMode[0]).trim();
        this.appnumber=this.studentdata.appnumber;

        console.log("Arush",this.appnumber);
        this.filename=this.appnumber;
        this.registerForm.get('firstname').setValue(this.firstname);
        this.registerForm.get('fathername').setValue(this.fathername);
        this.registerForm.get('mothername').setValue(this.mothername);
        this.registerForm.get('dob').setValue(this.dob);
        this.registerForm.get('gender').setValue(this.gender);
        this.registerForm.get('category').setValue(this.category);
        this.registerForm.get('email').setValue(this.email);
        this.registerForm.get('religion').setValue(this.religion);
        this.registerForm.get('address').setValue(this.address);
        this.registerForm.get('phone').setValue(this.phone);
        this.registerForm.get('adhnum').setValue(this.adhnum);
        this.registerForm.get('appnumber').setValue(this.appnumber);

      if (this.admissionMode=="NEW"){
        this.not_edit_firstname=true;
        this.not_edit_fathername=true;
        this.not_edit_mothername=true;
        this.not_edit_dob=true;
        this.not_edit_gender=true;
        this.not_edit_category=true;
        
        this.not_edit_email=false;
        this.not_edit_religion=false;
        this.not_edit_address=false;
        this.not_edit_religion=false;
        this.not_edit_phone=false;
        this.not_edit_adhnum=false;
        this.not_edit_firstname_hindi=false;
        this.not_edit_fathername_hindi=false;
        this.not_edit_mothername_hindi=false;


      }
      
      console.log("registration control",this.f.firstname);

       
    }

    // convenience getter for easy access to form fields
    get f() {
          
         return this.registerForm.controls; }
    
        

   

    onOptionsSelected(value){
      this.option=value;
      this.userservice.clear();
   

    }

    onSubmit() {

   this.userservice.clear();
   if (this.option=="Others" && !this.filests){
     this.userservice.log("File not uploaded");
return;
   }
          
        if (this.registerForm.invalid) {
       
            return;
        }
       
        this.registerForm.get('status').setValue('valid');
        this.changedata.emit(this.registerForm);
      

        
        // display form values on success
        alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.registerForm.value, null, 4));
    }

    
    isEnrolmentValid(){
      this.submitted = true;
     
      if (this.option=="DEI"){
          
           
      this.registerForm.controls["enrolmentnumber"].setValidators([onlyDigits,Validators.minLength(6),Validators.required]);
      //this.registerForm.controls["enrolmentnumber"].setValidators([onlyDigits,Validators.minLength(6),Validators.required]);
      this.submitted=true;
      let enrolmentnumber=this.f.enrolmentnumber.value;
      
      let myparam = {xmltojs:'Y',
      method:'None' }; 
       this.enrvaild=false;
     
     let  reg_params =new HttpParams();
       myparam.method='/registrationform/getEnrolmentDetails.htm';
       reg_params=reg_params.set("enrollmentno",enrolmentnumber);
       this.subs.add= this.userservice.getdata(reg_params,myparam).subscribe(res=>{
     
       res = JSON.parse(res);

       this.resulthandlergetEnrolmentDetails(res);
       console.log(res);
        
     },error=>{
      this.enrvaild=false;
      this.userservice.log("Please enter correct Enrolment number.");
     
       });

       
  
  
      }
      else{
          this.onSubmit();
      }
    }
      resulthandlergetEnrolmentDetails(res){
      let dob = String(res.studentdata.student[0].date_of_birth[0]).trim();
      let fathername = String(res.studentdata.student[0].father_name[0]).trim();
      let gender = String(res.studentdata.student[0].gender[0]).trim();
      let studentname = String(res.studentdata.student[0].student_name[0]).trim();
      console.log(studentname,fathername,gender,dob);
      let str:string =studentname+fathername+gender+dob;
      str=str.toLowerCase();
      str=str.replace(/\s/g, "");
      ;
      let str1=this.f.firstname.value+
      this.f.fathername.value+this.f.gender.value
      +this.f.dob.value;
      str1=str1.toLowerCase();
      str1=str1.replace(/\s/g, "");
      
      if(str===str1){
        this.enrvaild=true;
        this.onSubmit();
      }

      else{

      
      this.enrvaild=false;
      this.userservice.log("Please enter correct Enrolment number.");
      }

      
      }

     

    onReset() {
        this.submitted = false;
        this.registerForm.reset();
    }

    // handleFileInput(files: FileList) {
    //     this.fileToUpload = files.item(0);
        

    //     console.log('Arush',this.fileToUpload);
    // }

  //   uploadFileToActivity() {
     

  //     let obj = {xmltojs:'Y',
  //     method:'None' }; 
    
  //     console.log("inside upload file");  
    
    
  //   this.subs.add=this.userservice.postFile(this.fileToUpload,obj).subscribe(res=>{
  //     //this.userservice.log(" in switch detail selected");
  
  //    console.log(res);
  //   // res = JSON.parse(res);
  //     this.spinnerstatus=false;
     
  
    
     
  // },error=>{
  
    
  //   console.log("error in file upload",error);
  //     this.spinnerstatus=false;
      
  // })
        
  //     }

    
      onCancel(){
        this.elementRef.nativeElement.remove();
        //this.location.back();
        this.dialogRef.close();
        this.location.replaceState('/');
        this.router.navigate(['login']);

      }  

      onfileupload(_filests){
        this.filests=_filests;
      
      }

      onchange(){
        //debugger;
        this.userservice.clear();
      }
   
}




