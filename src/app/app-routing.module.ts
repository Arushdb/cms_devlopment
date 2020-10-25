import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FirstComponent } from './first/first.component';
import { HomeComponent } from './home/home.component';
import { SignonformComponent } from './signonform/signonform.component';
import { TestComponent } from './test/test.component';
import {AuthGuard} from './guards/auth.guard'


const routes:Routes=[
  //basic routes
  {path:'',redirectTo:'login',pathMatch:'full'},
  {path:'login',component:SignonformComponent},
    { 
    path: 'dashboard',canActivate:[AuthGuard],
    component: DashboardComponent,
    children : [
      { path: 'home', component: HomeComponent },
        { path: 'main', component: TestComponent  },
        { path: 'first', component: FirstComponent },
        
        
        
    ]
}
  

];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
