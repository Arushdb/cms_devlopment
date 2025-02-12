import { NgModule } from '@angular/core';

import { MenusComponent } from './menus/menus.component';
import { MenuItemComponent } from './menu-item/menu-item.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SharedModule } from '../shared/shared.module';
import { HeaderComponent } from './header/header.component';
import { RouterModule } from '@angular/router';
import { MenuRoutingModule } from './menu-routing.module';
import { SetpasswordComponent } from './setpassword/setpassword.component';


@NgModule({
  declarations: [
    MenusComponent,
    MenuItemComponent,
    DashboardComponent,
    HeaderComponent,
    SetpasswordComponent,
  ],
  imports: [SharedModule, MenuRoutingModule],
})
export class MenuModule {}
