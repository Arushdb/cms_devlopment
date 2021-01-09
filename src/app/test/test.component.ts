
import { ViewEncapsulation } from '@angular/core';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MenuItemComponent } from '../menu-item/menu-item.component';
import { StudentModule } from '../student/student.module';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css'],
  
})
export class TestComponent implements OnInit {

  @ViewChild(MenuItemComponent) myitem:MenuItemComponent;
  constructor() { }
  
  ngAfterViewInit() {
    console.log("Viewing  child Menu Item from test"+this.myitem); // Dolphin
  }

  public myarr=[
    {
     displayname:"Student",
     route :'StudentMod',
     children:[
       {
       displayname:"Registration",
       route:'registration_continue'
       },
       {
        displayname:"Aarat",
        route:'first'
      },

        {
          displayname:"Agam11"
          },
          {
           displayname:"Aarat11"
           }
      ] 
    
    },{
      displayname:"Teacher",
      children:[
        {
        displayname:"Internal Award Sheet",
        route:'Internal_award_sheet'
        },
        {
         displayname:"Aarat1"
         }
       ] 
     
     }
  
  ]
  

  ngOnInit(): void {
  }

}
