
import { Input, ViewEncapsulation } from '@angular/core';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MenuItemComponent } from '../menu-item/menu-item.component';

type MyType = {
  displayname:string;
  route:string;
  children:MyType;
}

@Component({
  selector: 'app-menus',
  templateUrl: './menus.component.html',
  styleUrls: ['./menus.component.css']
})
export class MenusComponent implements OnInit {

  @ViewChild(MenuItemComponent) myitem:MenuItemComponent;
  @Input() myarr:MyType[];



  constructor() { }
  
  ngAfterViewInit() {
    console.log("Viewing  child Menu Item from test"+this.myitem); // Dolphin
  }

  

  ngOnInit(): void {
  }

}
