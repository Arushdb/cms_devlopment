import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../guards/auth.guard';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MenusComponent } from './menus/menus.component';
import { AwardBlankSheetComponent } from '../award-sheet/award-blank-sheet/award-blank-sheet.component';
import { RegisterStudentComponent } from '../student/register-student/register-student.component';




const routes:Routes=[
  {path: 'dashboard',canActivate:[AuthGuard],
    component: DashboardComponent ,  
  children : [
  { path: 'main', component: MenusComponent },
  //{path:'Internal_award_sheet',component: AwardBlankSheetComponent,data:{displayType:"I"}, runGuardsAndResolvers: "always"},
  { path: 'Internal_award_sheet',
  loadChildren: () => import('../award-sheet/award-sheet.module').then(m => m.AwardSheetModule)} , 
  { path: 'registration_continue',
  loadChildren: () => import('../student/student.module').then(m => m.StudentModule)} , 
 // {path:'registration_continue',component: RegisterStudentComponent},   

 

 // {path:'Internal_award_sheet',loadChildren: () => import('../award-sheet/award-sheet.module').then(m => m.AwardSheetModule)} 
  ],         
 

  },

  {path:'**',redirectTo:'login',pathMatch:'full'}

];


@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(routes, {onSameUrlNavigation: "reload"})],
  exports: [RouterModule]
 
})
export class MenuRoutingModule { }
