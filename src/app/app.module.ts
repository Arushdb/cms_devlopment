import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule}  from '@angular/forms';
import { MatSliderModule } from '@angular/material/slider';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SignonformComponent } from './signonform/signonform.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CmsnavComponent } from './cmsnav/cmsnav.component';
import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import {MatMenuModule} from '@angular/material/menu';
import {MatDialogModule} from '@angular/material/dialog'
import { TestComponent } from './test/test.component';
import { MenuItemComponent } from './menu-item/menu-item.component';

import { DashboardComponent } from './dashboard/dashboard.component';
import { HomeComponent } from './home/home.component';
import { FirstComponent } from './first/first.component';

import { HttpClientModule,HTTP_INTERCEPTORS } from '@angular/common/http';
import { ThirdComponent } from './third/third.component';
import { AgGridModule } from 'ag-grid-angular';
import 'ag-grid-enterprise';
import { MygridComponent } from './mygrid/mygrid.component';

import {CookieService} from 'ngx-cookie-service';
import {HttpinterceptorService} from './services/httpinterceptor.service';
import {FormatInterceptorService} from './services/format-interceptor.service';
import { MessageComponent } from './message/message.component';
import {alertComponent  } from './common/alert.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { RxjsexampleComponent } from './rxjsexample/rxjsexample.component';

//import { LabelComponent } from './label/label.component';
import { AwardBlankSheetComponent } from './award-blank-sheet/award-blank-sheet.component';
import { NumericCellEditorComponent } from './numeric-cell-editor/numeric-cell-editor.component';
import { NumeriCellRendererComponent } from './numeri-cell-renderer/numeri-cell-renderer.component';
//import { GriddialogComponent } from './griddialog/griddialog.component';
import { GriddialogComponent } from './common/griddialog/griddialog.component';
import 'ag-grid-community';
import    {ProgressSpinnerComponent }  from  './common/progress-spinner/progress-spinner.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { HeaderComponent } from './header/header.component';
import { CustomComboboxComponent } from './common/custom-combobox/custom-combobox.component'; //added by Jyoti on 25 Feb 2021

//import { LabelComponent } from './label/label.component';
//import { AwardBlankSheetComponent } from './award-blank-sheet/award-blank-sheet.component';
//import {StudentModule} from  './student/student.module' ;
import { StartactivityComponent } from './resultprocessing/startactivity/startactivity.component';  //added by Jyoti on 25 Feb 2021
import { ConfirmwindowComponent } from './resultprocessing/confirmwindow/confirmwindow.component';  //added by Jyoti on 25 Feb 2021
import { MatInputModule } from '@angular/material/input'; //added by Jyoti on 25 Feb 2021


@NgModule({
  declarations: [
    AppComponent,
     SignonformComponent,
     
    CmsnavComponent,
    TestComponent,
    MenuItemComponent,
    DashboardComponent,
    HomeComponent,
    FirstComponent,
    ThirdComponent,
    MygridComponent,
  
    MessageComponent,
  
    alertComponent,
  
    RxjsexampleComponent,
    ProgressSpinnerComponent,
  
  
    //LabelComponent,
  
    //ResultProcessingComponent,
  
    AwardBlankSheetComponent,
  
    NumericCellEditorComponent,
  
    NumeriCellRendererComponent,
  
    GriddialogComponent,
  
    HeaderComponent,
    StartactivityComponent,
    ConfirmwindowComponent,
    CustomComboboxComponent
   
  ],
  imports: [
    BrowserModule,
    CommonModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
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
    AgGridModule.withComponents([]),
   
   
   MatAutocompleteModule,
   MatProgressSpinnerModule,
   MatCardModule, 
   MatInputModule,
   MatFormFieldModule,
    ReactiveFormsModule
   
  
  ],
  entryComponents: [
    alertComponent,
    GriddialogComponent
  ],
  providers: [
   
    [
      {provide :HTTP_INTERCEPTORS,useClass:HttpinterceptorService,multi:true},
      {provide :HTTP_INTERCEPTORS,useClass:FormatInterceptorService,multi:true},
      CookieService
     
    ]
  ],
  bootstrap: [AppComponent]
})


export class AppModule {

 }
