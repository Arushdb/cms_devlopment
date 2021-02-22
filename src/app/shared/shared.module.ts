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
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { AgGridModule } from 'ag-grid-angular';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';




@NgModule({
  declarations: [
      
   
   
    alertComponent,
   
    ProgressSpinnerComponent,
   
    
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
    FormsModule,
    MatDialogModule,
  //  StudentModule,
    //AgGridModule.withComponents([]),
   
   
   MatAutocompleteModule,
   MatProgressSpinnerModule,
   MatCardModule,
  ],
  exports: [
    CommonModule,
    alertComponent,
    ProgressSpinnerComponent,
    MatSliderModule,
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatMenuModule,
    FormsModule,
    MatDialogModule,
    //AgGridModule,
  //  StudentModule,
    //AgGridModule.withComponents([]),
   
   
   MatAutocompleteModule,
   MatProgressSpinnerModule,
   MatCardModule,
  ]
})
export class SharedModule { }
