
import { NgModule } from '@angular/core';

import { StudentRoutingModule } from './student-routing.module';
import {RegisterStudentComponent } from    './register-student/register-student.component' ;


import {SharedModule} from   'src/app/shared/shared.module'
import { AgGridModule } from 'ag-grid-angular';
//import { alertComponent } from '../shared/components/alert/alert.component';
//import { CustomComboboxComponent } from '../common/custom-combobox/custom-combobox.component';


@NgModule({
  declarations: [
    RegisterStudentComponent
  
  ],
  imports: [
    
    StudentRoutingModule,
    AgGridModule.withComponents([]),
    SharedModule
     
  ],
    
    exports:[]
})


export class StudentModule { }
