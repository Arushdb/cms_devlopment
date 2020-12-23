import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class alertComponent implements OnInit {


 constructor(private dialogRef: MatDialogRef<alertComponent> ,
  //@Inject(MAT_DIALOG_DATA) public data: {title: string,content:string,ok:boolean,cancel:boolean,color:string}) { }
  @Inject(MAT_DIALOG_DATA) public data) { 

    console.log("inside alert",data);
  }

  ngOnInit(): void {
  }


  // open(){
  //   this.dialogRef.
  // }
    close() {
      this.dialogRef.close(false);
  }

  okbuttonclick()
     {

    this.dialogRef.close(true);
  }

  }


  



