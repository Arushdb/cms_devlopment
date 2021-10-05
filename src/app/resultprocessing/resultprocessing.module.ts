import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';

import { StartactivityComponent } from './startactivity/startactivity.component';
import { ConfirmwindowComponent } from './confirmwindow/confirmwindow.component';
import { MatDialogModule } from '@angular/material/dialog';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule}  from  '@angular/material/progress-spinner' ;
import { MatFormFieldModule } from '@angular/material/form-field';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [StartactivityComponent, ConfirmwindowComponent],
  imports: [
    // CommonModule,BrowserModule,
    // MatDialogModule,MatButtonModule,MatInputModule,
    // ResultprocessingRoutingModule,
    // FormsModule,
    // ReactiveFormsModule,
    // MatProgressSpinnerModule,
    // MatFormFieldModule
    SharedModule,
  ],
  entryComponents: [
    ConfirmwindowComponent
  ]
})
export class ResultprocessingModule { }
