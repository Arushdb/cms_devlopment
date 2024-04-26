
//import { isNull } from '@angular/compiler/src/output/output_ast';
import { Component, ElementRef,  Inject,  OnChanges, OnDestroy, OnInit,  SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { SubscriptionContainer } from 'src/app/shared/subscription-container';
import { Location } from '@angular/common';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SchoolregistrationService } from 'src/app/services/schoolregistration.service';

import { SchoolMainComponent } from '../school-main/school-main.component';
import { student } from '../school-student/studentinterface';

interface mystudent {
  appno: string

}
export function onlyDigits(formControl: FormControl): { [key: string]: boolean } {
  const DIGIT_EXPS = /^\d*$/;

  if (!formControl.value.match(DIGIT_EXPS)) {

    return { 'NaN': true }
  }
}

@Component({
  selector: 'schoolstudentdetail',
  templateUrl: './school-student-detail.component.html',
  styleUrls: ['./school-student-detail.component.css']
})

export class SchoolStudentDetailComponent implements OnInit, OnDestroy, OnChanges {

  subs = new SubscriptionContainer();
  fileToUpload: File = null;
  upload = true;
  img: string = "";
  appno: mystudent[] = [];

  registerForm: FormGroup;
  submitted = false;

  admissionMode: string;
  appnumber: any;
  spinnerstatus: boolean;
  option: string;
  enrolvalid: boolean;
  enrvaild: boolean;
  filests: any;
  mode: any;
 
 
 


  constructor(private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<SchoolStudentDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private router: Router,
    private userservice: UserService,
    private elementRef: ElementRef,
    private location: Location,
    private schoolstudentservice: SchoolregistrationService,

  ) {


  }
  ngOnChanges(changes: SimpleChanges): void {



   
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
      motherFirstName: ['', Validators.required],


      gender: ['', Validators.required],
      category: ['', Validators.required],

      religion: ['', Validators.required],
      physicallyHandicapped: ['', Validators.required],
      minority: ['', Validators.required],
      perAddress: ['', Validators.required],
      perCity: ['', Validators.required],
      perState: ['UTTAR PRADESH', Validators.required],
      perPincode: ['', Validators.required],
      extraphone: ['', Validators.required],
      aadhaarNumber: ['', Validators.required],

      enrolmentno: [''],


      studentNameinHindi: [''],
      fatherNameinHindi: [''],
      motherNameinHindi: [''],

      dateOfBirth: ['', [Validators.required, Validators.pattern(/^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/)]],
      primaryEmailId: ['', [Validators.required, Validators.email]],

      studentId: [''],

      programId: [''],

      entityId: [''],
      branchCode: [''],
      processedflag: [''],
      mode: [''],
      semester_start_date: [''],



      filepath: [''],

      //filepath:[null,Validators.required, requiredFileType('png')] 

    });

  

    let ssc = <SchoolMainComponent>this.data.parent;

    let selectedrow:student;
    this.mode= this.data.mode;
    this.f.entityId.setValue(ssc.selectedschool);
    this.f.programId.setValue(ssc.selectedclass);
    this.f.branchCode.setValue(ssc.selectedbranch);
    if (this.data.mode === "add")
      this.f.filepath.setValidators(Validators.required);
    console.log(this.data);

    if (this.data.mode === "update" || this.data.mode === "delete") {
     // selectedrow = this.data.selectedrow[0].data;
      selectedrow = this.data.selectedrow;
     
      selectedrow.filepath = "";
      selectedrow.mode = "";

      this.registerForm.setValue(selectedrow);
    }


  }



  get f() {

    return this.registerForm.controls;
  }





  onOptionsSelected(value) {
    this.option = value;
    this.userservice.clear();


  }

  onSubmit() {
    this.submitted = true;
    this.f.mode.setValue(this.data.mode);

    if (this.data.mode === "add") {
      if (this.fileToUpload.size > 200000) {
        this.userservice.log("Please use Photo less than 200KB");
        return;
      }

      if (this.fileToUpload.type !== "image/jpeg" && this.fileToUpload.type !== "image/png") {
        this.userservice.log("Please use only Jpeg or png format in student photo");
        return;
      }

    }




    this.userservice.clear();


    if (this.registerForm.invalid) {

      return;
    }



    this.registerForm.get('studentNameinHindi').setValue(encodeURI(this.f.studentNameinHindi.value));
    this.registerForm.get('fatherNameinHindi').setValue(encodeURI(this.f.fatherNameinHindi.value));
    this.registerForm.get('motherNameinHindi').setValue(encodeURI(this.f.motherNameinHindi.value));


    let formobj = this.registerForm.getRawValue();

    let serializedForm = JSON.stringify(formobj);
    this.schoolstudentservice.savestudent(serializedForm
    ).subscribe(
      res => {

        // let mode =  this.registerForm.controls.mode.value; 
        let mode = this.f.mode.value;

        //let  mode:string=this.f.mode.get("mode").value();
        //this.f.mode.get(mode).value();
        if (mode === "add") {
          this.appno = JSON.parse(res);
          let appno = this.appno[0].appno;


          let obj = {
            xmltojs: 'N',
            method: 'None',
            filepath: "schoolphoto",
            filename: appno
          };

          this.userservice.postFile(this.fileToUpload, obj).subscribe(res => {

            this.userservice.log("Record successfully added.");


            this.dialogRef.close(true);

          }, err => {
            this.userservice.log("Some issue occured while uploading photo.Please try again.");
          });

        } else if (mode === "update") {
          this.userservice.log("Record successfully updated.");
          this.dialogRef.close(true);
        }
        else if (mode === "delete") {
          this.userservice.log("Record successfully deleted.");
          this.dialogRef.close(true);
        }


      }, error => {
        this.userservice.log("Record not added, Please try again.");
        this.dialogRef.close(false);
      });



  }


 
  onCancel() {

    this.dialogRef.close();
  
  }

 

  handleFileInput(event) {

    let myimage: HTMLElement = document.getElementById("imgid");
    myimage.setAttribute('src', URL.createObjectURL(event.target.files[0]));
 
    this.fileToUpload = event.target.files[0];
   
  }

}





