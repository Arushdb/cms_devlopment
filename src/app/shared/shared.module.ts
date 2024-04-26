import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProgressSpinnerComponent } from './progress-spinner/progress-spinner.component';
import { alertComponent } from './alert/alert.component'
import { MatSliderModule } from '@angular/material/slider';
import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import {MatDatepickerModule} from '@angular/material/datepicker';


import { MatDialogModule  } from '@angular/material/dialog';

import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatSelectModule} from '@angular/material/select';
import { CustomComboboxComponent } from './custom-combobox/custom-combobox.component';
import { MessageComponent } from 'src/app/shared/message/message.component';
import { GriddialogComponent } from './griddialog/griddialog.component';
import { NumeriCellRendererComponent } from './numeri-cell-renderer/numeri-cell-renderer.component';
import { AgGridModule } from 'ag-grid-angular';
import { UploadfileComponent } from './uploadfile/uploadfile.component';
import { ListComponent } from './list/list.component';

import { CustomButtonComponent } from './custom-button/custom-button.component';
import { DatePickerComponent } from './date-picker/date-picker.component';
import {MatNativeDateModule} from '@angular/material/core';



@NgModule({
  declarations: [
   // common components
    alertComponent,
    ProgressSpinnerComponent,
    CustomComboboxComponent,
    MessageComponent,
    GriddialogComponent, 
    NumeriCellRendererComponent, UploadfileComponent, ListComponent,  CustomButtonComponent, DatePickerComponent
   
    
  ],
  imports: [
  
    CommonModule,
    MatSliderModule,
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatMenuModule,
    MatDialogModule,
 
  
    MatAutocompleteModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
   
    AgGridModule.withComponents([]),

   

   FormsModule,
   ReactiveFormsModule,
   //AgGridModule.withComponents([]),
  ],
  exports: [
     // common componentsc
    
    alertComponent,
    ProgressSpinnerComponent,
    CustomComboboxComponent,
    MessageComponent,
    GriddialogComponent, 
    NumeriCellRendererComponent,
    UploadfileComponent,
    CustomButtonComponent,
    DatePickerComponent,
    
    //shared Module
    CommonModule,
    MatSliderModule,
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatMenuModule,
    MatDialogModule,
   
   
    MatAutocompleteModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
   
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,

    FormsModule,
    
    ReactiveFormsModule,

   //AgGridModule.withComponents([]),

    AgGridModule

  ]
})
export class SharedModule { }
