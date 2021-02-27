import { NgModule } from '@angular/core';

import { RouterModule, Routes } from '@angular/router';
import { AwardBlankSheetComponent } from './award-blank-sheet/award-blank-sheet.component';
import { DashboardComponent } from '../menu/dashboard/dashboard.component';
import { AuthGuard } from '../guards/auth.guard';

const routes:Routes=[
  
//   {path: 'dashboard',canActivate:[AuthGuard],
//   component: DashboardComponent ,  
// children : [
  {path:'',component: AwardBlankSheetComponent,data:{displayType:"I"},runGuardsAndResolvers: "always"},

//],         
//runGuardsAndResolvers: "always"

//}
];        
  
@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
 
})     


      
  

export class AwardsheetRoutingModule { }
