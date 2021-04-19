import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from '../app/menu/dashboard/dashboard.component';
import { MenusComponent } from '../app/menu/menus/menus.component';


import { SignonformComponent } from 'src/app/login/signonform/signonform.component';

import {AuthGuard} from './guards/auth.guard'
import { RegisterStudentComponent } from './student/register-student/register-student.component';

import { AwardBlankSheetComponent } from 'src/app/award-sheet/award-blank-sheet/award-blank-sheet.component';

//import { AwardBlankSheetComponent } from './award-blank-sheet/award-blank-sheet.component';



const routes:Routes=[
  //basic routes
 
  {path:'login',component:SignonformComponent},
  
     

   

        


       {path:'',redirectTo:'login',pathMatch:'full'}
  

];


@NgModule({
  imports: [RouterModule.forRoot(routes, {onSameUrlNavigation: "reload"})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
