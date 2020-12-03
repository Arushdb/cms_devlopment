import { Component, Inject, Input, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent implements OnInit {


 constructor(@Inject(MAT_DIALOG_DATA) public data: {title: string,content:string}) { }

  ngOnInit(): void {
  }



  
}


@Component({
  selector: 'Alert',
  template:
    `
    
  `
    ,
  styleUrls: ['./dialog.component.css']
})

export class alertComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
}