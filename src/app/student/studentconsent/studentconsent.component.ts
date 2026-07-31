import { Component, ElementRef, OnInit } from '@angular/core';
import {MatDialog, MatDialogConfig, MatDialogRef} from '@angular/material/dialog';
import { UserService } from 'src/app/services/user.service';
import { SubscriptionContainer } from 'src/app/shared/subscription-container';
import { HttpParams } from '@angular/common/http';
import {Location} from '@angular/common';

interface Branch {
  branchCode: string;
  branchName: string;
}

interface Specialization {
  specializationCode: string;
  specializationName: string;
  nextpck:string;
}

@Component({
  selector: 'app-studentconsent',
  templateUrl: './studentconsent.component.html',
  styleUrls: ['./studentconsent.component.css']
})
export class StudentconsentComponent implements OnInit {
  rollNo = '';
  rollNumber = '';
  message ='';
  consentExists = false;
  consentMessage = '';
  studentChoice = '';
  lastPassedYear = '';
  lastPassedSession = '';
  cgpa = '0';
  nextSemester = '';
  branches: Branch[] = [];
  specializations: Specialization[] = [];
  selectedBranch = '';
  selectedSpecializationId = '';
  subs = new SubscriptionContainer();
  spinnerstatus: boolean = false;
  params = new HttpParams().set('application','CMS');
  curDate = new Date;
  isNep = false;
  programName ='';
  branchName ='';
  specializationName ='';
  currentSem='';
  programId='';
  branchId='';
  currentSpclId:string='';
  semesterStartDate ='';
  semesterEndDate='';
  programCourseKey ='';
  proceedClicked:boolean=false;

  constructor( public dialog: MatDialog,
      private userservice: UserService,
      private elementRef:ElementRef,
      private location:Location
  ) { 
  }

  ngOnInit(): void 
  {
    this.rollNo = sessionStorage.getItem('rollNo') || '';
    this.getStudentDetails();
  }

  getStudentDetails() {
      let obj = { xmltojs: 'Y', method: 'None' };
      obj.method = '/studentConsent/getStudentDetails.htm';
      this.spinnerstatus = true;
      this.params = this.params.set("time", this.curDate.toString());
      this.subs.add = this.userservice.getdata(this.params, obj).subscribe((res: any) => {
        res = JSON.parse(res);
        this.spinnerstatus = false;
        let respNep = String(res.studentdata.student[0].isNep).trim() ;
        this.isNep = respNep === 'Y' ? true : false;
        //console.log("isNep", this.isNep);
        if (!this.isNep)
        {
          this.message = "This opton is intended only for SM7 students of NEP Programs.";
        }
        else
        {
            this.rollNumber = String(res.studentdata.student[0].rollNumber).trim() ;
            this.programName = String(res.studentdata.student[0].programName).trim() ;
            this.branchName = String(res.studentdata.student[0].branchName).trim() ;
            this.specializationName = String(res.studentdata.student[0].specializationName).trim() ;
            this.currentSem = String(res.studentdata.student[0].currentSemester).trim() ;
            this.programId = String(res.studentdata.student[0].programId).trim() ;
            this.branchId = String(res.studentdata.student[0].branchId).trim() ;
            this.currentSpclId = String(res.studentdata.student[0].specializationId).trim() ;
            this.programCourseKey = String(res.studentdata.student[0].programCourseKey).trim() ;
            this.getLastPassedYear();
        }
      });
  }

  getLastPassedYear(){
      let obj = { xmltojs: 'Y', method: 'None' };
      obj.method = '/studentConsent/getStudentLastPassedDtls.htm';
      this.spinnerstatus = true;
      this.params = this.params.set("time", this.curDate.toString());
      this.subs.add = this.userservice.getdata(this.params, obj).subscribe((res: any) => {
        res = JSON.parse(res);
        this.lastPassedYear = String(res.studentdata.student[0].lastPassedYear).trim() ;
        this.lastPassedSession = String(res.studentdata.student[0].lastPassedSession).trim() ;
        this.cgpa = String(res.studentdata.student[0].cgpa).trim() ;
      });
    if (this.isNep) {
        this.checkExistingConsent();
    }
  }

  checkExistingConsent() {
      let exitRecord = null;
      let continueRecord = null;
      let obj = { xmltojs: 'Y', method: 'None' };
      obj.method = '/studentConsent/checkStudentExitRecord.htm';
      this.spinnerstatus = true;
      this.params = this.params.set("time", this.curDate.toString());
      this.subs.add = this.userservice.getdata(this.params, obj).subscribe((res: any) => {
        res = JSON.parse(res);
        this.spinnerstatus = false;
        this.consentMessage = String(res.root.exception[0].exceptionstring[0]).trim();
        this.consentExists = this.consentMessage.includes('exit') ? true : false;
        exitRecord = this.consentExists;
      });

      if (exitRecord) {
        return;
      }
      else 
      {
        obj.method = '/studentConsent/checkStudentContinueRecord.htm';
        this.spinnerstatus = true;
        this.params = this.params.set("time", this.curDate.toString());
        this.subs.add = this.userservice.getdata(this.params, obj).subscribe((res: any) => {
              res = JSON.parse(res);
              this.spinnerstatus = false;
              this.consentMessage = String(res.root.exception[0].exceptionstring[0]).trim();
            //  console.log("consentmsg", this.consentMessage);
              this.consentExists = this.consentMessage.includes('continue') ? true : false;
              continueRecord = this.consentExists;
              });
      }  
    
      if (continueRecord) {
        return;
      }
  
  }

  proceed() 
  {
    this.proceedClicked = true;
    if (this.studentChoice === 'EXIT') {
      this.confirmExit();
    } else if (this.studentChoice === 'CONTINUE') {
      this.prepareContinueRegistration();
    }
  }

  confirmExit() {
    const confirmExit = confirm(
      'Do you want to exit after completion of Year ' +
      this.lastPassedYear + '?'
    );
    this.proceedClicked = false;
    if (confirmExit) {
      this.saveExitConsent();
    }
  }

  saveExitConsent() 
  {
    let obj = { xmltojs: 'Y', method: 'None' };
    obj.method = '/studentConsent/saveExitConsent.htm';
    this.spinnerstatus = true;
    this.params = this.params.set("rollNumber", this.rollNumber);
    this.params = this.params.set("lastPassedYear", this.lastPassedYear );
    this.params = this.params.set("lastPassedSession", this.lastPassedSession );
    this.params = this.params.set("currentpck", this.programCourseKey);
    this.subs.add = this.userservice.getdata(this.params, obj).subscribe((res: any) => {
        let resobj:any = JSON.parse(res);
        let msg:string= String(resobj.root.exception[0].exceptionstring[0]).trim();
        if (msg === "saved")
        {
            alert('Exit Consent Submitted Successfully');
            this.consentExists = true;
            this.consentMessage = 'Your consent to exit has been captured.';
        }
        else
        {
          this.consentExists = true;
          this.consentMessage = msg;
        }
    });
  }

  prepareContinueRegistration() {
    if (this.lastPassedYear === '1') {
      this.nextSemester = 'SM3';
    }
    if (this.lastPassedYear === '2') {
      this.nextSemester = 'SM5';
    }
    if (this.lastPassedYear === '3') {
      this.nextSemester = 'SM7';
    }
    this.loadBranches();
    this.loadSpecializations();
    this.handleAutoSelection();
  }

  loadBranches() {
    this.branches = [
      {
        branchCode: this.branchId,
        branchName: this.branchName
      }
    ];
  }

  loadSpecializations() {
      let obj = { xmltojs: 'Y', method: 'None' };
      obj.method = '/studentConsent/getnextSpcl.htm';
      this.spinnerstatus = true;
      this.params = this.params.set("nextSem", this.nextSemester);
      this.params = this.params.set("programId", this.programId);
      this.params = this.params.set("branchId", this.branchId);
      this.params = this.params.set("lastPassedYear", this.lastPassedYear);
      this.params = this.params.set("cgpa", this.cgpa);
      this.subs.add = this.userservice.getdata(this.params, obj).subscribe((res: any) => {
        res = JSON.parse(res);
        this.specializations = [];
        for (var obj of res.studentdata.student) {
          this.specializations.push({
            specializationCode: obj.specializationId[0],
            specializationName: obj.specializationName[0],
            nextpck: obj.nextpck[0]
          }); 
        }
      });

  }

  handleAutoSelection() {
    if (this.branches.length === 1) {
      this.selectedBranch =
        this.branches[0].branchCode;
    }
    if (this.specializations.length === 1) {
      this.selectedSpecializationId =
        this.specializations[0].specializationCode;
    }
  }

  onSpecializationChange(value: any)
  {
     //console.log('Selected:', value);
     console.log(this.selectedSpecializationId);
  }

  getBranchName() {
    return this.branches.find(
      x => x.branchCode === this.selectedBranch
    )?.branchName;
  }

  getSpecializationName() {
    return this.specializations.find(
      x => x.specializationCode ===
      this.selectedSpecializationId
    )?.specializationName;
  }

  getNextPck() {
    return this.specializations.find(
      x => x.specializationCode ===
      this.selectedSpecializationId
    )?.nextpck;
  }

  submitContinueConsent() {

    if (!this.selectedBranch) {
      alert('Select Branch');
      return;
    }

    if (!this.selectedSpecializationId) {
      alert('Select Specialization');
      return;
    }

    let confirmationText =
      'Do you want to continue with\n\n' +
      'Branch : ' +
      this.getBranchName() +
      '\n\nSpecialization : ' +
      this.getSpecializationName();

    if (confirm(confirmationText)) {
      this.saveContinueConsent();
    }

  }

  saveContinueConsent() {
   /* console.log("rollNumber", this.rollNumber, "nextSem", this.nextSemester,
      "programid", this.programId, "branchid", this.branchId, 
      "spclId", this.selectedSpecializationId, 
      "spcl", this.getSpecializationName(), "nextpck", this.getNextPck());
    */
    let obj = { xmltojs: 'Y', method: 'None' };
    let message = "";
    let npck : any = this.getNextPck();
    obj.method = '/studentConsent/saveContinueConsent.htm';
    this.spinnerstatus = true;
    this.params = this.params.set("rollNumber", this.rollNo);
    this.params = this.params.set("nextSem", this.nextSemester );
    this.params = this.params.set("programId", this.programId );
    this.params = this.params.set("branchId", this.branchId);
    this.params = this.params.set("specializationId", this.selectedSpecializationId);
    this.params = this.params.set("currentpck", this.programCourseKey );
    this.params = this.params.set("currentSpclId", this.currentSpclId);
    this.params = this.params.set("nextpck", npck.toString());
    this.subs.add = this.userservice.getdata(this.params, obj).subscribe((res: any) => {
        let resobj:any = JSON.parse(res);
        message = resobj.root.exception[0].exceptionstring[0];
        //console.log(message);
        if (message === "saved")
        {
           alert('Consent Submitted Successfully');
          this.consentExists = true;
          this.consentMessage =
              'Your consent to continue with branch ' + this.getBranchName()  + ', specialization '+
              this.getSpecializationName() + ' and semester ' + this.nextSemester + ' has been captured.';
        }
        else {
          this.consentExists = true;
          this.consentMessage = message;
        }
      });
  
  }

  onCancel(){
    this.location.back();
    this.subs.dispose();
    this.elementRef.nativeElement.remove();
  }

  ngOnDestroy(): void 
  {
    this.subs.dispose();
    this.elementRef.nativeElement.remove();
  }

}
