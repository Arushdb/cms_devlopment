import { Component, ElementRef, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, GridOptions, GridReadyEvent } from 'ag-grid-community';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  @ViewChild('agGrid') agGrid: AgGridAngular;
  @ViewChild('header') header:ElementRef;
   
   public columnDefs : ColDef[];
   public rowData : [];
 
   

  defaultColDef = {
    sortable: true,
    floatingFilter: true,
    resizable: true,
    flex: 1,
    filter: 'agTextColumnFilter'
       
};



gridOptions:GridOptions ;


  constructor(private dialogRef: MatDialogRef<ListComponent> ,
    //@Inject(MAT_DIALOG_DATA) public data: {title: string,content:string,ok:boolean,cancel:boolean,color:string}) { }
    @Inject(MAT_DIALOG_DATA) public data,
    
    private userservice:UserService) { }

  ngOnInit(): void {
   // this.gridOptions.columnDefs=this.columnDefs;
   this.rowData=this.data.rowData;
   
   

   this.columnDefs=this.data.columnDefs;
   this.agGrid.api.sizeColumnsToFit();
   

  }

  OngridReady(event:GridReadyEvent){
   // this.header.nativeElement.innerHTML="Revert Process";
    this.header.nativeElement.innerText=this.data.header;
    console.log(this.data);
  
      //this.gridOptions.columnDefs=this.columnDefs;
      //this.gridOptions.rowData=this.rowData;
     
 
}

onClose(){

  this.dialogRef.close(false);

}
onConfirm(){
  this.dialogRef.close(true);

}
}
