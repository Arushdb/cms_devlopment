
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AgGridModule } from 'ag-grid-angular';

import {SharedModule} from   '../shared/shared.module'

import { AwardBlankSheetComponent } from './award-blank-sheet/award-blank-sheet.component';
import { GriddialogComponent } from './griddialog/griddialog.component';
import { NumeriCellRendererComponent } from './numeri-cell-renderer/numeri-cell-renderer.component';
import { AwardsheetRoutingModule } from './awardsheet-routing.module';



@NgModule({
  declarations: [AwardBlankSheetComponent,GriddialogComponent, NumeriCellRendererComponent
  ],
  imports: [
 
    SharedModule,
    AgGridModule.withComponents([]),
    AwardsheetRoutingModule,
    
  ],
  //exports:[AwardsheetRoutingModule]
})
export class AwardSheetModule { }
