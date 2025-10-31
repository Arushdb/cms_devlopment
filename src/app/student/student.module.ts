
import { NgModule } from '@angular/core';

import { StudentRoutingModule } from './student-routing.module';
import {RegisterStudentComponent } from    './register-student/register-student.component' ;


import {SharedModule} from   'src/app/shared/shared.module'
import { AgGridModule } from 'ag-grid-angular';
import { StudentmarksComponent } from './studentmarks/studentmarks.component';
import { UndertakingComponent } from '../login/undertaking/undertaking.component';
import { SchoolStudentComponent } from './school-student/school-student.component';
import { SchoolMainComponent } from './school-main/school-main.component';

import { SchoolStudentDetailComponent } from './school-student-detail/school-student-detail.component';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { UploadApplicationNumbersComponent } from './upload-application-numbers/upload-application-numbers.component';


//import { alertComponent } from '../shared/components/alert/alert.component';
//import { CustomComboboxComponent } from '../common/custom-combobox/custom-combobox.component';


@NgModule({
  declarations: [
    RegisterStudentComponent,
    StudentmarksComponent,
    UndertakingComponent,
    SchoolStudentComponent,
    SchoolMainComponent,
   
    SchoolStudentDetailComponent,
    FileUploadComponent,
    UploadApplicationNumbersComponent,
   
    

   
  
  ],
  imports: [
    SharedModule,
    
    StudentRoutingModule,
    AgGridModule.withComponents([]),
  
       
  ],
  providers:[],

    exports:[]
})


export class StudentModule { }
