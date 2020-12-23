import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgGridModule } from 'ag-grid-angular';
//import * as Collections from 'typescript-collections' ;

import {MatProgressSpinnerModule}  from  '@angular/material/progress-spinner' ;
import {MatCardModule}  from  '@angular/material/card' ;

import { StudentRoutingModule } from './student-routing.module';
import {RegisterStudentComponent } from    './register-student/register-student.component' ;
import { ProgressSpinnerComponent } from './progress-spinner/progress-spinner.component';


import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CustomComboboxComponent } from './custom-combobox/custom-combobox.component';
//import { CustomComboboxComponent } from '../common/custom-combobox/custom-combobox.component';


@NgModule({
  declarations: [
    RegisterStudentComponent,
    ProgressSpinnerComponent,
    CustomComboboxComponent
    


  ],
  imports: [
    CommonModule,
    StudentRoutingModule,
    AgGridModule.withComponents([]),
    MatProgressSpinnerModule,
    FormsModule,
    MatCardModule,
    
     MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule
    
   // Collections
  ]
})


export class StudentModule { }
