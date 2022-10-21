import { Component, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { StudentService } from 'src/app/services/student.service';
import { SubscriptionContainer } from 'src/app/shared/subscription-container';
import { Location } from '@angular/common';
import { isUndefined } from 'typescript-collections/dist/lib/util';


@Component({
  selector: 'app-studentaverage',
  templateUrl: './studentaverage.component.html',
  styleUrls: ['./studentaverage.component.css']
})
export class StudentaverageComponent implements OnInit {

  spinnerstatus: boolean;
  subs = new SubscriptionContainer();
  averageForm: FormGroup;
  average1;
  semaverage1 = "";
  program1: any;
  average2;
  semaverage2 = "";
  program2: any;
  status2;
  status1;
  submitted: boolean;

  resary: any[];
  error: boolean;


  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private location: Location,
    private studentservice: StudentService,
    private elementRef: ElementRef) { }


  ngOnInit(): void {
    this.averageForm = this.formBuilder.group({
      //title: ['', Validators.required],
      rollnumber: ['', Validators.required],
      yeargroup: ['', Validators.required],


    });

  }
  getaverage() {
    debugger;
    this.studentservice.clear();
    this.submitted = true;

    if (!(this.averageForm.valid))
      return;


    this.average1 = "";
    this.semaverage1 = "";
    this.program1 = "";
    this.average2 = "";
    this.semaverage2 = "";
    this.program2 = "";

    let avform = this.averageForm.getRawValue();
    let serializedForm = JSON.stringify(avform);

    this.subs.add=this.studentservice.getStudentYearlyAverage(avform).subscribe(res => {
      let result = JSON.parse(res);
      this.resary = [];
      this.resary = result.basicDetails.Details;
      if (!(isUndefined(this.resary))) {
        debugger;
        this.status1 = "";
        this.status2 = "";
        this.error = false;

        this.status1 = String(this.resary[0]["status"]).trim();
        if (this.status1 == "good") {

          this.average1 = this.resary[0]["average"];
          this.semaverage1 = this.resary[0]["sgpa"];
          this.program1 = this.resary[0]["program"];
          this.error = false;

        } else {
          this.error = true;
        }
        if (this.resary.length > 1) {


          this.status2 = String(this.resary[1]["status"]).trim();
          if (this.status2 == "good") {
            this.average2 = this.resary[1]["average"];
            this.semaverage2 = this.resary[1]["sgpa"];
            this.program2 = this.resary[1]["program"];
            this.error = false;

          } else {

          }
        }

      } else {
        this.studentservice.log("Yearly Average not available");
        return;
      }

      if (this.error) {
        this.studentservice.log("Yearly Average not available");
      }

      this.submitted = false;
    }, err => { });





  }
  onclose() {
    this.location.back();
  }

  get f() {

    return this.averageForm.controls;
  }
  ngOnDestroy(): void {

    this.subs.dispose();
    // this.elementRef.nativeElement.remove();


  }
}
