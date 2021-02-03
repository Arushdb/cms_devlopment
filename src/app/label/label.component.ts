import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { appProperties } from 'src/app/appProperties';


@Component({
  selector: 'app-label',
  templateUrl:'./label.component.html',
  styleUrls: ['./label.component.css']
})
export class LabelComponent implements OnInit ,AfterViewInit{
@Input() message:string;
  constructor() {  }
  
  ngAfterViewInit(): void {
    console.log("in label component",appProperties[this.message]);
  }

  ngOnInit(): void {

    this.message = appProperties[this.message];
    console.log("in label component",appProperties[this.message]);
  }

}
