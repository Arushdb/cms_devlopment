import { NgModule } from '@angular/core';
import { Routes, RouterModule, Router } from '@angular/router';
import { DashboardComponent } from '../app/menu/dashboard/dashboard.component';
import { MenusComponent } from '../app/menu/menus/menus.component';


import { SignonformComponent } from 'src/app/login/signonform/signonform.component';



import { StudentregistrationreportComponent } from './login/studentregistrationreport/studentregistrationreport.component';
import { AdmmainComponent } from './newadmission/admmain/admmain.component';
import { LoginformComponent } from './login/loginform/loginform.component';

//import { AwardBlankSheetComponent } from './award-blank-sheet/award-blank-sheet.component';



const routes:Routes=[
  //basic routes
 
  {path:'login',component:SignonformComponent},
  {path:'downloadreport',component:StudentregistrationreportComponent},
 
 

       {path:'',redirectTo:'login',pathMatch:'full'}
  

];


@NgModule({
  imports: [RouterModule.forRoot(routes,
     {onSameUrlNavigation: "reload", enableTracing: true})],
  exports: [RouterModule]
})
export class AppRoutingModule {
  constructor(
    private readonly router: Router,
  ) {
    router.events
      .subscribe(console.log);

  }
  }

 
