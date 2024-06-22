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
import { CourseevaluationComponent } from './courseevaluation/courseevaluation.component';
import { TemplateComponent } from './courseevaluation/template/template.component';
import { MatTooltipModule } from '@angular/material/tooltip';
//import {StudentModule} from  './student/student.module' ;

@NgModule({
  declarations: [
    AppComponent,
    CourseevaluationComponent,
    TemplateComponent,
   
     
   
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
    MatTooltipModule,


    //AgGridModule.withComponents([])
    
  
   
  
  ],
  entryComponents: [
  

  ],
  providers: [
   
    [

      {provide :HTTP_INTERCEPTORS,useClass:HttpinterceptorService,multi:true},
      {provide :HTTP_INTERCEPTORS,useClass:FormatInterceptorService,multi:true},
 
     
    ]
  ],
  bootstrap: [AppComponent]
})


export class AppModule {

 }
