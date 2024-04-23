import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { MyItem } from 'src/app/interfaces/my-item';
import { SchoolregistrationService } from 'src/app/services/schoolregistration.service'
import { SubscriptionContainer } from 'src/app/shared/subscription-container';
import { student } from '../school-student/studentinterface';

interface programbranch {
  programid: string,
  branchid: string,
  programname: string,
  branchname: string
}

@Component({
  selector: 'app-school-main',
  templateUrl: './school-main.component.html',
  styleUrls: ['./school-main.component.css']
})



export class SchoolMainComponent implements OnInit {

  
  schoolControl = new FormControl(null, Validators.required);
  classControl = new FormControl(null, Validators.required);
  branchControl = new FormControl(null, Validators.required);
  selectFormControl = new FormControl('', Validators.required);

  spinnerstatus: string = "";
  selectedschool: string = "";
  selectedclass: string = "";
  selectedclasslabel:string;
  selectedbranchlabel:string;
  selectedbranch: string = "";
  studentdata:student[]=[];
 
  programbranchList: programbranch[] = [];
  branchList: programbranch[] = [];
  subs = new SubscriptionContainer();

 


  
  schoolList: MyItem[] = []
  
  classList: MyItem[] = [];
  dataentry: boolean;
  //branchList: MyItem[] = [{ id: "mth-sci", label: "Math-Science" }, { id: "com", label: 'Commerce' }];

  constructor(
    private schoolservice: SchoolregistrationService

  ) { }

  ngOnInit(): void {
    this.dataentry=false;

    this.getschool();
    this.getprogram();
    this.getbranches();
    


  }
  getschool() {
    this.subs.add=  this.schoolservice.getschool().subscribe((res) => {

      this.schoolList = JSON.parse(res);
   
    }, error => {
      console.log(error);
    });
  }

  getprogram() {
    this.subs.add= this.schoolservice.getschoolprograms().subscribe((res) => {

      this.classList = JSON.parse(res);

    }, error => {
      console.log(error);
    });
  }

  getbranches() {
    this.subs.add= this.schoolservice.getschoolbranches().subscribe((res) => {
    
      this.branchList = JSON.parse(res);
      
    }, error => {
      console.log(error);
    });
  }

  onProgramChange(event: MatSelectChange) {
    this.dataentry=false;
    this.selectedbranch = "";
   
    this.programbranchList = this.branchList.filter((v,i,self)=>{
      if(v.programid==this.selectedclass){
        return true;
      }
      });

     
     
  }
  onSchoolChange(event: MatSelectChange) {
    this.selectedbranch = "";
    this.selectedclass = "";
    this.dataentry=false;
  }
  
  onBranchChange(event: MatSelectChange) {
    this.dataentry=false;
    if (this.selectedbranch!==''){
     this.dataentry=true;
    
      
    } 
        
        else{
          alert("this.dataentry flag is: "+this.dataentry );
          this.dataentry=false;
        }
        this.selectedclasslabel="";

     
        this.classList.forEach(res=>{
         if(res.id===this.selectedclass){
          this.selectedclasslabel= res.label;
       
         } });
          
         this.branchList.forEach(res1=>{
          if(res1.branchid===this.selectedbranch){
           this.selectedbranchlabel= res1.branchname;
           return;
          } });
       

        console.log( this.selectedclasslabel);
  }
 



  

}
