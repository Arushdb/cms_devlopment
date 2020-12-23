import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CustomComboboxComponent } from './custom-combobox/custom-combobox.component';


import { RegisterStudentComponent } from './register-student/register-student.component';


const routes: Routes = [
    


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudentRoutingModule { 

  
}
