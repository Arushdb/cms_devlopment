import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegisterStudentComponent } from './register-student/register-student.component';


const routes: Routes = [
  {path: '',redirectTo:'StudentMod'},
  
  {path:'registration_continue',component: RegisterStudentComponent}
    

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudentRoutingModule { 

  
}
