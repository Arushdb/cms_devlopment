import { NgModule } from '@angular/core';


import { SignonformComponent } from './signonform/signonform.component';
import { SharedModule } from '../shared/shared.module';

import { LoginRoutingModule } from './login-routing.module';
import { LoginformComponent } from './loginform/loginform.component';
import { RouterModule } from '@angular/router';
import { StudentpersonaldetailComponent } from './studentpersonaldetail/studentpersonaldetail.component';
import { NewregistrationComponent } from './newregistration/newregistration.component';
import {StudentregistrationreportComponent} from './studentregistrationreport/studentregistrationreport.component';
import { StudentaverageComponent } from './studentaverage/studentaverage.component'


@NgModule({
  declarations: [SignonformComponent, LoginformComponent,
     StudentpersonaldetailComponent, NewregistrationComponent,
     StudentregistrationreportComponent,
     StudentaverageComponent],
  imports: [
  
  SharedModule,
  RouterModule,
  LoginRoutingModule,
  
 
  ],
  exports: []
})
export class LoginModule { }
