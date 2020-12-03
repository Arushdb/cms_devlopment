import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegisterStudentComponent } from './register-student/register-student.component';


const routes: Routes = [
    
   

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudentRoutingModule { 

  
}
