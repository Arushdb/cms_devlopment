import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ViewChild } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import {Location} from '@angular/common';

import {UserService} from  'src/app/services/user.service' ;


@Component({
  selector: 'register-student',
  templateUrl: './register-student.component.html',
  styleUrls: ['./register-student.component.css']
})
export class RegisterStudentComponent implements OnInit {
  @ViewChild('agGrid') agGrid: AgGridAngular;
  title = 'my-app';
  
  myparam = {xmltojs:'Y',
             method:'None' }; 
  public myrowData=[];


  rowData = [
    { make: 'Toyota', model: 'Celica', price: 35000 },
    { make: 'Ford', model: 'Mondeo', price: 32000 },
    { make: 'Porsche', model: 'Boxter', price: 72000 },
    { make: 'Toyota', model: 'Celica', price: 35000 },
    { make: 'Ford', model: 'Mondeo', price: 32000 },
    { make: 'Porsche', model: 'Boxter', price: 72000 },
    { make: 'Toyota', model: 'Celica', price: 35000 },
    { make: 'Ford', model: 'Mondeo', price: 32000 },
    { make: 'Porsche', model: 'Boxter', price: 72000 },
    { make: 'Toyota', model: 'Celica', price: 35000 },
    { make: 'Ford', model: 'Mondeo', price: 32000 },
    { make: 'Porsche', model: 'Boxter', price: 72000 },
];

  defaultColDef = {
    sortable: true,
    filter: true
       
};

columnDefs = [
  { field: 'courseCode',checkboxSelection: true  },
  { field: 'coursename' },
  { field: 'credits' }
];
// columnDefs = [
//   { field: 'make' },
//   { field: 'price' }
// ];

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
      this.myparam.method= "/registrationforstudent/gettencodes.htm";
   // this.params =this.params.set('method','/registrationforstudent/gettencodes.htm');
     console.log(this.params);
     let data = null;
         this.userservice.getdata(this.params,this.myparam).subscribe(res=>{

          this.userservice.log("Ten code selected");
          data = JSON.parse(res);

          console.log("response :",data);
         
          // xml2js.parseString( res, function (err, result){

          //   data = result;
           
           
          //      });

          //      console.log(this);

               if(data.registerDetails.Detail[0].available as string =="N"){
                this.getswitchdetail();
            
              }

               
              

         })
     
    //  this.userservice.gettencodes(params).subscribe(res=>{
    //    console.log(res);
    //  });
  }


  getswitchdetail(){
   // this.params=this.params.set('method','/registrationforstudent/getswitchdetail.htm');
   // console.log(this.params);
    this.myparam.method='/registrationforstudent/getswitchdetail.htm';
   let data = null;
    this.userservice.getdata(this.params,this.myparam).subscribe(res=>{
      //this.userservice.log(" in switch detail selected");
      data = JSON.parse(res);
      // xml2js.parseString( res, function (err, result){
      //  data = result;
        
      // });

      // console.log(data);

      if(data.registerDetails.Detail[0].available as string =="N"){
        this.getcourses();
    
      }




  })

  }



  getcourses(){
   // this.params=this.params.set('method','/registrationforstudent/getcourses.htm');
    this.myparam.method='/registrationforstudent/getcourses.htm';
    this.params=this.params.append('switchType','NON');
    this.params=this.params.append('module','');
    let data = null;
    this.userservice.getdata(this.params,this.myparam).subscribe(res=>{
    //   let data = null;
    //   xml2js.parseString( res, function (err, result){
    //    data = result;
    // });
    data = JSON.parse(res);
   // this.myrowData=data;

    console.log("in get courses",data);

    this.userservice.log("courses selected");
    

    this.myrowData=data.registerDetails.Detail;
   //this.myrowData = this.rowData;
   

   // this.myrowData = this.rowData;
    //console.log(this.myrowData);
    
  });
 
  


} 

goBack(): void {
  this.location.back();
}
}
