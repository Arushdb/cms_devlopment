import { importType } from '@angular/compiler/src/output/output_ast';
//import {NavItem} from './nav-item' ;
import {Component, ViewChild, ViewEncapsulation} from '@angular/core';


interface NavItem {
  displayName: string;
  disabled?: boolean;
  iconName: string;
  route?: string;
  children?: NavItem[];
}

@Component({
  selector: 'start-app',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class AppComponent  {
  
  
}
