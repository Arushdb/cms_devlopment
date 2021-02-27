import { NgModule } from '@angular/core';

import { MenusComponent } from './menus/menus.component';
import { MenuItemComponent } from './menu-item/menu-item.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {SharedModule} from '../shared/shared.module';
import {HeaderComponent} from './header/header.component'
import {  RouterModule } from '@angular/router';
import { MenuRoutingModule } from './menu-routing.module';



@NgModule({
  declarations: [MenusComponent,MenuItemComponent,DashboardComponent,HeaderComponent],
  imports: [
    SharedModule,
   
    MenuRoutingModule
  
  ]
})
export class MenuModule { }
