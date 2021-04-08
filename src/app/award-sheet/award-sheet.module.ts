

import { NgModule } from '@angular/core';
import { AgGridModule } from 'ag-grid-angular';

import {SharedModule} from   '../shared/shared.module'

import { AwardBlankSheetComponent } from './award-blank-sheet/award-blank-sheet.component';
//import { GriddialogComponent } from './griddialog/griddialog.component';
//import { NumeriCellRendererComponent } from './numeri-cell-renderer/numeri-cell-renderer.component';
import { AwardsheetRoutingModule } from './awardsheet-routing.module';




@NgModule({
  //declarations: [AwardBlankSheetComponent,GriddialogComponent, NumeriCellRendererComponent
  declarations: [AwardBlankSheetComponent
  ],
  imports: [
 
    SharedModule,
    //AgGridModule.withComponents([]),
    AwardsheetRoutingModule,
    
  ],
  
})
export class AwardSheetModule { }
