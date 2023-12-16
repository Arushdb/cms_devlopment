import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import {jsPDF} from 'jspdf';
import html2canvas from 'html2canvas';
import { FlleserviceService } from 'src/app/services/flleservice.service';
import { SubscriptionContainer } from 'src/app/shared/subscription-container';
import { UserService } from 'src/app/services/user.service';
import { HttpParams } from '@angular/common/http';
import {Location} from '@angular/common';
@Component({
  selector: 'app-undertaking',
  templateUrl: './undertaking.component.html',
  styleUrls: ['./undertaking.component.css']
})
export class UndertakingComponent implements OnInit {
  //@ViewChild('pdfTable', {static: false}) pdfTable: ElementRef;

  @ViewChild('htmlData') htmlData!: ElementRef;
  name:string;
  rollno:string;
  program:any;
  faculty:any;
  address:any;
  day:any;
  month:any;
  year:any;
  
  candidate:any;
  pdffile:Blob;
  spinnerstatus: boolean=false;
  subs = new SubscriptionContainer();
  reg_params:HttpParams;
  showundertaking:boolean=false;
  phone:string="";

  @Output() agreed=new EventEmitter<boolean>();
  @Input() rollnumber:string;

  

 PDF = new jsPDF('p', 'mm', 'a4');
  fatherName: any;
  today: string;


  constructor(private fileservice:FlleserviceService,
    private userservice:UserService,
    private elementRef:ElementRef,
    private location:Location
    ) { }

  ngOnInit(): void {
    debugger;
  let today = new Date();
 this.day = String(today.getDate()).padStart(2, '0');
this.month = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
this.year = today.getFullYear();

this.today = this.day + '/' + this.month + '/' + this.year;
    this.reg_params = new HttpParams()
  .set('application','CMS');
    // this.rollno =localStorage.getItem("id");
    // this.reg_params.set('roll_number',this.rollnumber);
    this.getstudentdetail();
  }

  public downloadAsPDF() {
    const doc = new jsPDF('p', 'pt', 'letter');
    var options = {
      orientation: 'p',
    unit: 'mm',
  format: 'a4',
  putOnlyUsedFonts:false,
      background: '#fff' //background is transparent if you don't set it, which turns it black for some reason.
  };

    const specialElementHandlers = {
      '#editor': function (element, renderer) {
        return true;
      }
    };


    
    //doc.html(pdfTable.innerHTML);

    //doc.save('tableToPdf.pdf');
  }

  public savePDF(): void {
    let con =confirm("Student you are required to download this anti-ragging undertaking and submit the hardcopy duly signed by you (student) and parents or gaurdian in the faculty office") ;
    if (con ===false)
    return;
    let DATA: any = document.getElementById('htmlData');
    html2canvas(DATA).then((canvas) => {
      let fileWidth = 208;
      let fileHeight = (canvas.height * fileWidth) / canvas.width;
      const FILEURI = canvas.toDataURL('image/png');
       this.PDF = new jsPDF('p', 'mm', 'a4');
      
       debugger;  
      let position = 10;
      this.PDF.addImage(FILEURI, 'PNG', 0, position, fileWidth, fileHeight);
      
       this.PDF.save('undertaking.pdf');
      this.pdffile=this.PDF.output('blob');
      this.uploadPdfFile();
      this.agreed.emit(true);
    
    
    });
  }
// standard font in jspdf
//   Courier
// Courier-Bold
// Courier-BoldOblique
// Courier-Oblique
// Helvetica
// Helvetica-Bold
// Helvetica-BoldOblique
// Helvetica-Oblique
// Symbol
// Times-Roman
// Times-Bold
// Time-Italic
// Time-BoldItalic

  // openPDF(): void {
  //   const DATA = this.htmlData.nativeElement;
  //   const doc: jsPDF = new jsPDF(
      
  //     "p", "mm", "a4");
  //   doc.setFontSize(9);
  //   doc.setFont("Helvetica");
  //   doc.html(DATA, {
  //      callback: (doc) => {
  //        doc.output("dataurlnewwindow");
  //      }
  //   });
  // }


  uploadPdfFile() {
     
    const formdata: FormData = new FormData();
    formdata.append('pdfFile', this.pdffile); // Should match the parameter name in backend
    this.fileservice.uploadPdfFile(formdata)
    .subscribe(
    (data) => {
      console.log('Upload File ' + data);
    },
    (error) => {
      console.log(error.error);
    });
  }
  getstudentdetail(){
    let obj = {xmltojs:'Y',
    method:'None' }; 
    debugger;
   
      
  obj.method='/registrationform/getStudentDetailsforundertaking.htm';
  this.spinnerstatus=true;
  
  this.subs.add=this.userservice.getdata(this.reg_params,obj).subscribe((res:any)=>{
    console.log(res);
    res = JSON.parse(res);
debugger;
 
  this.faculty=res.data.student[0].entity_name;
  this.name=res.data.student[0].studentName;
  this.candidate=res.data.student[0].studentName;
  this.rollno=res.data.student[0].roll_number;
  this.address=res.data.student[0].perAddress;
  this.phone=res.data.student[0].officePhone;
  this.program=res.data.student[0].program_name;
  this.fatherName=res.data.student[0].fatherName;
  console.log(String(res.data.student[0].entity_name));
    
    this.spinnerstatus=false;
    this.showundertaking=true;

    console.log(res);
    //this.loading = false;

  });
    //this.userservice.log(" in switch detail select

}

onCancel(){
  this.location.back();
  this.subs.dispose();
  this.elementRef.nativeElement.remove();
}
ngOnDestroy(): void {
  this.subs.dispose();
  this.elementRef.nativeElement.remove();
 
}

}

  
  
