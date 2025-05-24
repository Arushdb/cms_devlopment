import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AgGridModule } from 'ag-grid-angular';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { SharedModule } from '../shared/shared.module'; 

import { AssignCoursesComponent } from './assigncourses/assigncourses.component';

@NgModule({
  declarations: [AssignCoursesComponent],
  imports: [
    CommonModule,
    BrowserModule,
  
   // FormsModule,
   // HttpClientModule,
   // AgGridModule.withComponents([]),
   // MatDialogModule,
  //  MatButtonModule,
  //  BrowserAnimationsModule,
  SharedModule
    
  ],
  

  providers: [],
  exports: [AssignCoursesComponent],
})
export class InstructorModule {}