import { HttpParams } from '@angular/common/http';
//import { isNull } from '@angular/compiler/src/output/output_ast';
import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { SubscriptionContainer } from 'src/app/shared/subscription-container';
import {Location} from '@angular/common';

import { MatDialogRef } from '@angular/material/dialog';



export function onlyDigits(formControl: FormControl): {[key: string]: boolean} {
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

   // @ViewChild('uploadfile') public uploadfile:UploadfileComponent;
  
    
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
       
    
    admissionMode: string;
    appnumber: any;
  spinnerstatus: boolean;
  option: string;
  enrolvalid: boolean;
  enrvaild: boolean;
  filests: any;
  filename: string;
  filepath: string;

 

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
            firstName: ['', Validators.required],
            fatherFirstName: ['', Validators.required],
            fatherMiddleName: [''],
            fatherLastName: [''],

            motherFirstName: ['', Validators.required],
            motherMiddleName: [''],
            motherLastName: [''],
           
            gender: ['', Validators.required],
            category: ['', Validators.required],
           
            religion: ['', Validators.required],
            physicallyHandicapped: ['', Validators.required],
            minority: ['', Validators.required],
            perAddress: ['', Validators.required],
            officePhone: ['', Validators.required],
            aadhaarNumber: ['', Validators.required],
          
            enrollmentNumber: [''],
            lastdegree: ['', Validators.required],

            studentNameinHindi: ['', Validators.required],
            fatherNameinHindi: ['', Validators.required],
            motherNameinHindi: ['', Validators.required],
         
            dateOfBirth: ['', [Validators.required, Validators.pattern(/^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/)]],
            primaryEmailId: ['', [Validators.required, Validators.email]],
            status:[''],
            studentId:[''],
            sessionStartDate:[''],
            sessionEndDate:[''],
            programId:[''],
            masterExists:[''],

            regRollNumber:[''],
            registrationNumber:[''],

            entityId:[''],
            branchCode:[''],
            newSpecialization:[''],
            semesterCode:[''],
            sequenceNumber:[''],
            admissionMode:[''],
            attempt:[''],
            rollNumberGroupCode:[''],
            longField:[''],
          
            
            
           

            
        }

       
      
        );
        this.option="-1";
        
        console.log("Arush",this.studentdata);
        //this.firstName=String(this.studentdata.studentdata.student[0].first_name[0]).trim();
        
        this.appnumber=this.studentdata.appnumber;

    
        this.filename=this.appnumber+"_Lastdegree";
       
        this.registerForm.get('firstName').setValue(String(this.studentdata.studentdata.student[0].first_name[0]).trim());
        this.registerForm.get('fatherFirstName').setValue(String(this.studentdata.studentdata.student[0].father_name[0]).trim());
        this.registerForm.get('motherFirstName').setValue(String(this.studentdata.studentdata.student[0].motherFirstName[0]).trim());
        this.registerForm.get('dateOfBirth').setValue(String(this.studentdata.studentdata.student[0].date_of_birth[0]).trim());
        this.registerForm.get('gender').setValue(String(this.studentdata.studentdata.student[0].gender[0]).trim());
        this.registerForm.get('category').setValue(String(this.studentdata.studentdata.student[0].category[0]).trim());
        this.registerForm.get('perAddress').setValue(String(this.studentdata.studentdata.student[0].address[0]).trim());
        this.registerForm.get('officePhone').setValue(String(this.studentdata.studentdata.student[0].homePhone[0]).trim());
        this.registerForm.get('aadhaarNumber').setValue(String(this.studentdata.studentdata.student[0].aadhaarNumber[0]).trim());
        this.registerForm.get('religion').setValue(String(this.studentdata.studentdata.student[0].religion[0]).trim());
        this.registerForm.get('primaryEmailId').setValue(String(this.studentdata.studentdata.student[0].primary_email_id[0]).trim());
        
        
     
        this.registerForm.get('regRollNumber').setValue(String(this.studentdata.appnumber).trim());
        this.registerForm.get('registrationNumber').setValue(String(this.studentdata.appnumber).trim());
      
       
        this.registerForm.get('appnumber').setValue(this.appnumber);
        
        this.registerForm.get('studentId').setValue(String(this.studentdata.studentdata.student[0].student_id[0]).trim());
        this.registerForm.get('sessionStartDate').setValue(String(this.studentdata.studentdata.student[0].session_start_date[0]).trim());
        this.registerForm.get('sessionEndDate').setValue(String(this.studentdata.studentdata.student[0].session_end_date[0]).trim());
        this.registerForm.get('programId').setValue(String(this.studentdata.studentdata.student[0].program_id[0]).trim());
        this.registerForm.get('masterExists').setValue(String(this.studentdata.studentdata.student[0].masterExists[0]).trim());
        this.registerForm.get('entityId').setValue(String(this.studentdata.studentdata.student[0].entity_id[0]).trim());
        this.registerForm.get('branchCode').setValue(String(this.studentdata.studentdata.student[0].branch_code[0]).trim());
        this.registerForm.get('newSpecialization').setValue(String(this.studentdata.studentdata.student[0].new_specialization[0]).trim());
        this.registerForm.get('semesterCode').setValue(String(this.studentdata.studentdata.student[0].semester_code[0]).trim());
        this.registerForm.get('sequenceNumber').setValue(String(this.studentdata.studentdata.student[0].sequence_number[0]).trim());
        this.registerForm.get('admissionMode').setValue(String(this.studentdata.studentdata.student[0].admissionMode[0]).trim());
        this.registerForm.get('attempt').setValue(String(this.studentdata.studentdata.student[0].attempt[0]).trim());
        this.registerForm.get('rollNumberGroupCode').setValue(String(this.studentdata.studentdata.student[0].rollNumberGroupCode[0]).trim());
        this.registerForm.get('longField').setValue(String(this.studentdata.studentdata.student[0].longField[0]).trim());
        
         
        

      if (this.f.admissionMode.value=="NEW"){
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
     // console.log("Arush",String(this.f.sessionEndDate.value));
    
 let path ="";
 let  sessionend = parseInt(String(this.f.sessionStartDate.value).slice(2,4))+1;
    path = "Degree/"+String(this.f.sessionStartDate.value).slice(0,5)+String(sessionend)+"/"+this.f.entityId.value+"/"+this.f.programId.value;
   // console.log("Arush",path);
    this.filepath=path;
       
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
       // alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.registerForm.value, null, 4));
    }

    
    isEnrolmentValid(){
      this.submitted = true;
     
      if (this.option=="DEI"){
          
           
      this.registerForm.controls["enrollmentNumber"].setValidators([onlyDigits,Validators.minLength(6),Validators.required]);
     
      this.submitted=true;
     
      
      let myparam = {xmltojs:'Y',
      method:'None' }; 
       this.enrvaild=false;
     
     let  reg_params =new HttpParams();
    this.spinnerstatus=true;
       myparam.method='/registrationform/getEnrolmentDetails.htm';
       reg_params=reg_params.set("enrollmentno",this.f.enrollmentNumber.value);
       this.subs.add= this.userservice.getdata(reg_params,myparam).subscribe(res=>{
        this.spinnerstatus=false;
       res = JSON.parse(res);

       this.resulthandlergetEnrolmentDetails(res);
       console.log(res);
        
     },error=>{
      this.enrvaild=false;
      this.userservice.log("Please enter correct Enrolment number.");
      this.spinnerstatus=false;
     
       });

       
  
  
      }
      else{
          this.onSubmit();
      }
    }
      resulthandlergetEnrolmentDetails(res){
      let dateOfBirth = String(res.studentdata.student[0].date_of_birth[0]).trim();
      let fatherFirstName = String(res.studentdata.student[0].father_name[0]).trim();
      let gender = String(res.studentdata.student[0].gender[0]).trim();
      let studentname = String(res.studentdata.student[0].student_name[0]).trim();
      console.log(studentname,fatherFirstName,gender,dateOfBirth);
      let str:string =studentname+fatherFirstName+gender+dateOfBirth;
      str=str.toLowerCase();
      str=str.replace(/\s/g, "");
      ;
      let str1=this.f.firstName.value+
      this.f.fatherFirstName.value+this.f.gender.value
      +this.f.dateOfBirth.value;
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




