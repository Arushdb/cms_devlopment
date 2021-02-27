import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ICellEditorAngularComp, ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams, IAfterGuiAttachedParams } from 'ag-grid-community';

import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-numeri-cell-renderer',
  templateUrl: './numeri-cell-renderer.component.html',
  styleUrls: ['./numeri-cell-renderer.component.css']
})
export class NumeriCellRendererComponent implements  ICellRendererAngularComp {
  public params: any;
  public value: any;

  @ViewChild('input', { read: ViewContainerRef }) public input;

  hasError= false;
  constructor(private userservice:UserService,) { }
  refresh(params: any): boolean {
    //if((params.value==="Z")||(params.value!=="Z" && parseInt(params.value)>40)){
      //console.log("value === Z",params.value);
      //this.value="Incorrect value";
    //}else{
      //console.log("value not Z",params.value);
      console.log(params.value);
      this.value=params.value;
     
      if( this.value==="Z"  ||  this.value==="Invalid" ){
        
        this.hasError =true ;
        this.userservice.log("Marks entered not correct");
       }else{
        this.hasError=false;
       }
    //}
   return true;
  }
  agInit(params: ICellRendererParams): void {
   
  
   this.value=params.value;
   if( this.value==="Z" || this.value==="Invalid"){
   
    this.hasError =true ;
   }else{
    this.hasError=false;
   }
   

  }

    afterGuiAttached?(params?: IAfterGuiAttachedParams): void {
    
    //this.value=params.value;
  }
  
 
}
