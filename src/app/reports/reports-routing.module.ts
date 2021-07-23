import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DistanceCenterComponent } from './distance-center/distance-center.component';

const routes: Routes = [
    
 {path:'',component: DistanceCenterComponent},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule { }

