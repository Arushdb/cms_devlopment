import { NgModule } from '@angular/core';

import { Route, RouterModule, Routes, UrlSegment, UrlSegmentGroup } from '@angular/router';
import { AwardBlankSheetComponent } from './award-blank-sheet/award-blank-sheet.component';


const routes:Routes=[

 
  
 // {path:'Internal_award_sheet',  component: AwardBlankSheetComponent,data:{displayType:"I"},runGuardsAndResolvers: "always"},
 // {path:'',  component: AwardBlankSheetComponent,data:{displayType:"I"},runGuardsAndResolvers: "always"},
  

];        

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
 
})     

export class AwardsheetRoutingModule { 

}

