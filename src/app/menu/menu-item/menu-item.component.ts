import { ElementRef, Input } from '@angular/core';
import { ViewChild } from '@angular/core';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-menu-item',
  templateUrl: './menu-item.component.html',
  styleUrls: ['./menu-item.component.css']
})
export class MenuItemComponent implements OnInit {

  //myvar:String ="Arush-Menu-Item";
  
  @Input()  items=[];

  //@ViewChild('childMenu') public childMenu;
  @ViewChild('childMenu', {static: true}) public childMenu: any;
  constructor() { }

  ngOnInit(): void {
  }
  ngAfterViewInit() {
    //console.log(this.childMenu);
  }

    log(x) {
    //console.log(x[0]);  
  }
  

}
