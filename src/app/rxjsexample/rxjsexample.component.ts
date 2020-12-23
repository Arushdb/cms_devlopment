import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';


import { tap } from 'rxjs/operators';
import { fromEvent,from } from 'rxjs';

@Component({
  selector: 'app-rxjsexample',
  templateUrl: './rxjsexample.component.html',
  styleUrls: ['./rxjsexample.component.css']
})
export class RxjsexampleComponent implements AfterViewInit {

  
@ViewChild('btn',{ read: ElementRef }) btn:ElementRef;
@ViewChild('name',{ read: ElementRef }) name:ElementRef;
     num=[22,33,44,55,66]; 
  constructor() { }

  
  ngAfterViewInit() {
    fromEvent(this.btn.nativeElement,'click').subscribe((e:MouseEvent)=>{
      console.log("clicked123",e);
    } )
    fromEvent(this.name.nativeElement,'keyup').subscribe(function(e:KeyboardEvent){
      console.log("typed on input",e);
    } )
   from(this.num).subscribe(v=>{
     console.log(v);
    },
    err=>{
console.log(err);

    }
   
    );
   
  }
  Onclick(){
   
  

  }


}
