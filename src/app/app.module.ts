import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

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
//import { ResultProcessingComponent } from './result-processing/result-processing.component';
//import { AwardBlankSheetComponent } from './award-blank-sheet/award-blank-sheet.component';



//import {StudentModule} from  './student/student.module' ;

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
  
  
    //LabelComponent,
  
    //ResultProcessingComponent,
  
    //AwardBlankSheetComponent
  
   // CustomComboboxComponent
  
    
    
    
   
  ],
  imports: [
    BrowserModule,
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
   // MatFormFieldModule,
   
    //ReactiveFormsModule
   
  
  ],
  entryComponents: [
    alertComponent
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
