
//import { isNull } from '@angular/compiler/src/output/output_ast';
import { Component, ElementRef, EventEmitter, Inject, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { SubscriptionContainer } from 'src/app/shared/subscription-container';
import {Location} from '@angular/common';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SchoolregistrationService } from 'src/app/services/schoolregistration.service';
import { error } from '@angular/compiler/src/util';
import { HttpParams } from '@angular/common/http';
import { SchoolStudentComponent } from '../school-student/school-student.component';
import { SchoolMainComponent } from '../school-main/school-main.component';
import { Timestamp } from 'rxjs/internal/operators/timestamp';


interface student {
  appno: string
  
}
export function onlyDigits(formControl: FormControl): {[key: string]: boolean} {
  const DIGIT_EXPS = /^\d*$/;
  
  if (!formControl.value.match(DIGIT_EXPS)) {

    return {'NaN': true}
  } 
}

@Component({
  selector: 'schoolstudentdetail',
  templateUrl: './school-student-detail.component.html',
  styleUrls: ['./school-student-detail.component.css']
})

export class SchoolStudentDetailComponent implements OnInit,OnDestroy ,OnChanges {

    @Input() studentdata :any;
    @Input() flag :boolean;
    @Input() selectedschool:string;
    @Input() selectedclass:string;
    @Input() selectedbranch:string;
   
    @Output() changedata= new EventEmitter<FormGroup>();

   // @ViewChild('uploadfile') public uploadfile:UploadfileComponent;
  
   //public dialogRef: MatDialogRef<SchoolStudentDetailComponent>;
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
     img:string="";

     appno: student[] = [];
    
   
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
  appnumber1: string;
  myappno: string;
  
  

 

    constructor(private formBuilder: FormBuilder, 
      private dialogRef: MatDialogRef<SchoolStudentDetailComponent>,
      @Inject(MAT_DIALOG_DATA) public data,
      private router: Router,
      private userservice:UserService,
      private elementRef:ElementRef,
      private location:Location,
      private schoolstudentservice:SchoolregistrationService,
     
      ) 
      {

        
     }
  ngOnChanges(changes: SimpleChanges): void {

    
  
    // if(changes.flag.currentValue){
    //   this.registerForm.get('studentNameinHindi').setValue(decodeURI(this.f.studentNameinHindi.value));
    // this.registerForm.get('fatherNameinHindi').setValue(decodeURI(this.f.fatherNameinHindi.value));
    // this.registerForm.get('motherNameinHindi').setValue(decodeURI(this.f.motherNameinHindi.value));


    // }
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
            perCity: ['', Validators.required],
            perState: ['UTTAR PRADESH', Validators.required],
            perPincode: ['', Validators.required],
            officePhone: ['', Validators.required],
            aadhaarNumber: ['', Validators.required],
          
            enrollmentNumber: [''],
       

            studentNameinHindi: [''],
            fatherNameinHindi: [''],
            motherNameinHindi: [''],
         
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
            user:[''],
            filepath:[null,Validators.required] ,
           
            //filepath:[null,Validators.required, requiredFileType('png')] 
                    
        });
     let ssc =<SchoolMainComponent> this.data.parent;
    
     
  this.f.entityId.setValue(ssc.selectedschool);
  this.f.programId.setValue(ssc.selectedclass);
  this.f.branchCode.setValue(ssc.selectedbranch);
      
  

//         this.option="-1";
        
//         console.log("Arush",this.studentdata);
//         //this.firstName=String(this.studentdata.studentdata.student[0].first_name[0]).trim();
        
//         this.appnumber=this.studentdata.appnumber;

    
//         this.filename=this.appnumber+"_Lastdegree";
       
//         this.registerForm.get('firstName').setValue(String(this.studentdata.studentdata.student[0].first_name[0]).trim());
//         this.registerForm.get('fatherFirstName').setValue(String(this.studentdata.studentdata.student[0].father_name[0]).trim());
//         this.registerForm.get('motherFirstName').setValue(String(this.studentdata.studentdata.student[0].motherFirstName[0]).trim());
//         this.registerForm.get('dateOfBirth').setValue(String(this.studentdata.studentdata.student[0].date_of_birth[0]).trim());
//         this.registerForm.get('gender').setValue(String(this.studentdata.studentdata.student[0].gender[0]).trim());
//         this.registerForm.get('category').setValue(String(this.studentdata.studentdata.student[0].category[0]).trim());
//         this.registerForm.get('perAddress').setValue(String(this.studentdata.studentdata.student[0].address[0]).trim());
//         this.registerForm.get('officePhone').setValue(String(this.studentdata.studentdata.student[0].homePhone[0]).trim());
//         this.registerForm.get('aadhaarNumber').setValue(String(this.studentdata.studentdata.student[0].aadhaarNumber[0]).trim());
//         this.registerForm.get('enrollmentNumber').setValue(String(this.studentdata.studentdata.student[0].enrollment_number[0]).trim());
//         this.registerForm.get('religion').setValue(String(this.studentdata.studentdata.student[0].religion[0]).trim());
//         this.registerForm.get('primaryEmailId').setValue(String(this.studentdata.studentdata.student[0].primary_email_id[0]).trim());
        
        
     
//         this.registerForm.get('regRollNumber').setValue(String(this.studentdata.appnumber).trim());
//         this.registerForm.get('registrationNumber').setValue(String(this.studentdata.appnumber).trim());
      
       
//         this.registerForm.get('appnumber').setValue(this.appnumber);
        
//         this.registerForm.get('studentId').setValue(String(this.studentdata.studentdata.student[0].student_id[0]).trim());
//         this.registerForm.get('sessionStartDate').setValue(String(this.studentdata.studentdata.student[0].session_start_date[0]).trim());
//         this.registerForm.get('sessionEndDate').setValue(String(this.studentdata.studentdata.student[0].session_end_date[0]).trim());
//         this.registerForm.get('programId').setValue(String(this.studentdata.studentdata.student[0].program_id[0]).trim());
//         this.registerForm.get('masterExists').setValue(String(this.studentdata.studentdata.student[0].masterExists[0]).trim());
//         this.registerForm.get('entityId').setValue(String(this.studentdata.studentdata.student[0].entity_id[0]).trim());
//         this.registerForm.get('branchCode').setValue(String(this.studentdata.studentdata.student[0].branch_code[0]).trim());
//         this.registerForm.get('newSpecialization').setValue(String(this.studentdata.studentdata.student[0].new_specialization[0]).trim());
//         this.registerForm.get('semesterCode').setValue(String(this.studentdata.studentdata.student[0].semester_code[0]).trim());
//         this.registerForm.get('sequenceNumber').setValue(String(this.studentdata.studentdata.student[0].sequence_number[0]).trim());
//         this.registerForm.get('admissionMode').setValue(String(this.studentdata.studentdata.student[0].admissionMode[0]).trim());
//         this.registerForm.get('attempt').setValue(String(this.studentdata.studentdata.student[0].attempt[0]).trim());
//         this.registerForm.get('rollNumberGroupCode').setValue(String(this.studentdata.studentdata.student[0].rollNumberGroupCode[0]).trim());
//         this.registerForm.get('longField').setValue(String(this.studentdata.studentdata.student[0].longField[0]).trim());
        
     
        

//       if (this.f.admissionMode.value=="NEW"){
//         this.not_edit_firstname=true;
//         this.not_edit_fathername=true;
//         this.not_edit_mothername=true;
//         this.not_edit_dob=true;
//         this.not_edit_gender=true;
//         this.not_edit_category=true;
        
//         this.not_edit_email=false;
//         this.not_edit_religion=false;
//         this.not_edit_address=false;
//         this.not_edit_religion=false;
//         this.not_edit_phone=false;
//         this.not_edit_adhnum=false;
//         this.not_edit_firstname_hindi=false;
//         this.not_edit_fathername_hindi=false;
//         this.not_edit_mothername_hindi=false;


//       }
//      // console.log("Arush",String(this.f.sessionEndDate.value));
    
//  let path ="";
//  let  sessionend = parseInt(String(this.f.sessionStartDate.value).slice(2,4))+1;
//     path = "Degree/"+String(this.f.sessionStartDate.value).slice(0,5)+String(sessionend)+"/"+this.f.entityId.value+"/"+this.f.programId.value;
//    // console.log("Arush",path);
//     this.filepath=path;
       

//   this.f.studentNameinHindi.setValidators(([Validators.required]));
//   this.f.fatherNameinHindi.setValidators(([Validators.required]));
//   this.f.motherNameinHindi.setValidators(([Validators.required]));


    }

    // convenience getter for easy access to form fields
    get f() {
          
         return this.registerForm.controls; }
    
        

   

    onOptionsSelected(value){
      this.option=value;
      this.userservice.clear();
   

    }

    onSubmit() {
      this.submitted = true;

          

      if (this.fileToUpload.size >200000)

      {
        this.userservice.log("Please use Photo less than 200KB");
        return;
      }
      
      if (this.fileToUpload.type!=="image/jpeg"  &&this.fileToUpload.type!=="image/png" ){
        this.userservice.log("Please use only Jpeg or png format in student photo");
        return;
      }
      

   this.userservice.clear();

          
        if (this.registerForm.invalid) {
       
            return;
        }
       
        this.registerForm.get('status').setValue('valid');
        let strhindi:string="";

    
        strhindi =encodeURI(this.f.studentNameinHindi.value);
        this.registerForm.get('studentNameinHindi').setValue(encodeURI(this.f.studentNameinHindi.value));
        this.registerForm.get('fatherNameinHindi').setValue(encodeURI(this.f.fatherNameinHindi.value));
        this.registerForm.get('motherNameinHindi').setValue(encodeURI(this.f.motherNameinHindi.value));
        
      //   strhindi = this.f.studentNameinHindi.value;
      //  strhindi= encodeURI(strhindi);
        

    

      //this.getappno() ;

      //this.appnumber1="S"+String(this.f.firstName.value).slice(0,2).toUpperCase() + new Date().valueOf();


      
      
      // let num1= new Date().valueOf().toString().slice(0,9);
      // let num2=parseInt(num1)*Math.random();
      // this.appnumber="S"+String(this.f.firstName.value).slice(0,2).toUpperCase() + num2 ;
    
     // this.f.appnumber.setValue(this.appnumber);  

      //debugger;
      let formobj =this.registerForm.getRawValue();  

      let serializedForm = JSON.stringify(formobj);
      this.schoolstudentservice.savestudent(serializedForm
        ).subscribe(
        res=>{
        
          this.appno = JSON.parse(res);
          let appno=this.appno[0].appno;
          // const d = new Date();
          // let year= d.getFullYear();    
          // appno="S"+year+appno;
          
          let obj = {xmltojs:'N',
          method:'None', 
          filepath:"schoolphoto",
          filename:appno
                 }; 

        this.userservice.postFile(this.fileToUpload ,obj).subscribe(res=>{
     
          this.userservice.log("Record successfully added.");
          this.dialogRef.close();  

        },err=>{
         this.userservice.log("Some issue occured while uploading photo.Please try again.");
        });
 

                 
          
        },error=>{
          this.userservice.log("Record not added, Please try again.");
          
        });
      
                     
       
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

        this.dialogRef.close();
        //this.elementRef.nativeElement.remove();
        //this.location.back();
        //this.dialogRef.close();
        //this.location.replaceState('/');
        //this.router.navigate(['login']);

      }  

      onfileupload(_filests){
        this.filests=_filests;
      
      }

      onchange(){
        //debugger;
        this.userservice.clear();
      }

     // handleFileInput(files: FileList) {
      handleFileInput(event) {

        //handleFileInput($event.target.files)
        //this.fileToUpload = files.item(0);
        
        debugger;
        let myimage:HTMLElement  =  document.getElementById("imgid");
        myimage.setAttribute('src',URL.createObjectURL(event.target.files[0]));
        // const files = event.target.files;
        // files.
        this.fileToUpload=event.target.files[0];
        //this.img=this.f.filepath.value;
        
    }
   
}





