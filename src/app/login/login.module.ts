import { NgModule } from '@angular/core';


import { SignonformComponent } from './signonform/signonform.component';
import { SharedModule } from '../shared/shared.module';

import { LoginRoutingModule } from './login-routing.module';
import { LoginformComponent } from './loginform/loginform.component';
import { RouterModule } from '@angular/router';
import { StudentpersonaldetailComponent } from './studentpersonaldetail/studentpersonaldetail.component';
import { StudentModule } from '../student/student.module';
import { NewregistrationComponent } from './newregistration/newregistration.component';






@NgModule({
  declarations: [SignonformComponent, LoginformComponent, StudentpersonaldetailComponent, NewregistrationComponent],
  imports: [
  
  SharedModule,
  RouterModule,
  LoginRoutingModule,
 
  ]
})
export class LoginModule { }
