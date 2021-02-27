import { NgModule } from '@angular/core';

import { SignonformComponent } from './signonform/signonform.component';
import { SharedModule } from '../shared/shared.module';

import { LoginRoutingModule } from './login-routing.module';





@NgModule({
  declarations: [SignonformComponent],
  imports: [
  
  SharedModule,
 
  
  LoginRoutingModule
  ]
})
export class LoginModule { }
