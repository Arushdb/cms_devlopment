import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import {LoginModule} from 'src/app/login/login.module';
import {MenuModule} from 'src/app/menu/menu.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule,HTTP_INTERCEPTORS } from '@angular/common/http';
import {HttpinterceptorService} from './services/httpinterceptor.service';
import {FormatInterceptorService} from './services/format-interceptor.service';
import { SharedModule } from './shared/shared.module';
import { AgGridModule } from 'ag-grid-angular';
import { AwardSheetModule } from './award-sheet/award-sheet.module';
import {ResultprocessingModule} from './resultprocessing/resultprocessing.module';
import  {RevertresultModule} from './revertresult/revertresult.module';
import { StudentModule } from './student/student.module';
import { CourseGradeLimitComponent } from './course-grade-limit/course-grade-limit.component';
import { PopupComponent } from './popup/popup.component';
import { MatDialogModule } from '@angular/material/dialog';
import { DataServiceService } from './data-service.service';


//import {StudentModule} from  './student/student.module' ;

@NgModule({
  declarations: [
    AppComponent,
    CourseGradeLimitComponent,
    PopupComponent,
    
   
     
   
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    SharedModule,
    AwardSheetModule,
    LoginModule,
    StudentModule,
    MenuModule,
    ResultprocessingModule,
    RevertresultModule,
    MatDialogModule


    //AgGridModule.withComponents([])
    
  
   
  
  ],
  entryComponents: [
  

  ],
  providers: [
   
    [
      {provide :HTTP_INTERCEPTORS,useClass:HttpinterceptorService,multi:true},
      {provide :HTTP_INTERCEPTORS,useClass:FormatInterceptorService,multi:true},
      DataServiceService
 
     
    ]
  ],
  bootstrap: [AppComponent]
})


export class AppModule {

 }
