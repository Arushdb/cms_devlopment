import { HttpParams } from '@angular/common/http';
import { Component, OnInit, ɵConsole } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import{RegistrationService} from '../services/registration.service';
import * as xml2js from 'xml2js';
import { ViewChild } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import {MessageService}   from '../services/message.service';
import {Location} from '@angular/common'
import { UserService } from '../services/user.service';

@Component({
  selector: 'register-student',
  templateUrl: './register-student.component.html',
  styleUrls: ['./register-student.component.css']
})
export class RegisterStudentComponent implements OnInit {
  @ViewChild('agGrid') agGrid: AgGridAngular;

  public rowData=[];

  defaultColDef = {
    sortable: true,
    filter: true,
    
    
};

columnDefs = [
  { field: 'courseCode',checkboxSelection: true  },
  { field: 'coursename' },
  { field: 'credits' }
];


   params = new HttpParams()
  .set('application','CMS');
  constructor(private router:Router,
    private userservice:UserService,
    route:ActivatedRoute,
    
    private location:Location
    ) { 
  }

  ngOnInit(): void {
    this.gettencode();
  }

  getSelectedRows() {
    const selectedNodes = this.agGrid.api.getSelectedNodes();
    const selectedData = selectedNodes.map(node => node.data );
    const selectedDataStringPresentation = selectedData.map(node => node.courseCode + ' ' + node.coursename).join(', ');

    alert(`Selected nodes: ${selectedDataStringPresentation}`);
}

  gettencode(){
      
    this.params =this.params.set('method','/registrationforstudent/gettencodes.htm');
     console.log(this.params);
    
         this.userservice.getdata(this.params).subscribe(res=>{

          this.userservice.log("Ten code selected");
          
          let data = null;
          xml2js.parseString( res, function (err, result){

            data = result;
           
           
               });

               console.log(this);

               if(data.registerDetails.Detail[0].available as string =="N"){
                this.getswitchdetail();
            
              }

               
              

         })
     
    //  this.userservice.gettencodes(params).subscribe(res=>{
    //    console.log(res);
    //  });
  }


  getswitchdetail(){
    this.params=this.params.set('method','/registrationforstudent/getswitchdetail.htm');
    console.log(this.params);
    this.userservice.getdata(this.params).subscribe(res=>{
      this.userservice.log(" in switch detail selected");
     let data = null;
      xml2js.parseString( res, function (err, result){
       data = result;
        
      });

      console.log(data);

      if(data.registerDetails.Detail[0].available as string =="N"){
        this.getcourses();
    
      }




  })

  }



  getcourses(){
    this.params=this.params.set('method','/registrationforstudent/getcourses.htm');
    this.params=this.params.append('switchType','NON');
    this.params=this.params.append('module','');
    
    this.userservice.getdata(this.params).subscribe(res=>{
      let data = null;
      xml2js.parseString( res, function (err, result){
       data = result;
    });

    console.log("in get courses",data);

    this.rowData=data.registerDetails.Detail;

    console.log(this.rowData);

    
  });

  


} 

goBack(): void {
  this.location.back();
}
}
