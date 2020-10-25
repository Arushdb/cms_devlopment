
import { ViewEncapsulation } from '@angular/core';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MenuItemComponent } from '../menu-item/menu-item.component';

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
     displayname:"Arush",
     children:[
       {
       displayname:"Agam",
       route:'home'
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
      displayname:"Arush1",
      children:[
        {
        displayname:"Agam1"
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
