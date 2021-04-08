import { NgModule } from '@angular/core';
import { RouterModule,Routes } from '@angular/router';
import { CoursegradelimitComponent } from './coursegradelimit/coursegradelimit.component';




const routes:Routes=[

  {path:'',component: CoursegradelimitComponent,runGuardsAndResolvers: "always"},
    

 ];        

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GradelimitRoutingModule { }
