import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgGridModule } from 'ag-grid-angular';

import { StudentRoutingModule } from './student-routing.module';
import {RegisterStudentComponent } from    './register-student/register-student.component' ;


@NgModule({
  declarations: [
    RegisterStudentComponent

  ],
  imports: [
    CommonModule,
    StudentRoutingModule,
    AgGridModule.withComponents([])
  ]
})


export class StudentModule { }
