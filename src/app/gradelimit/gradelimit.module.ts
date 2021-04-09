import { NgModule } from '@angular/core';
 
import {SharedModule} from   '../shared/shared.module'
import { CoursegradelimitComponent } from './coursegradelimit/coursegradelimit.component';
import { GradelimitRoutingModule } from './gradelimit-routing.module';



@NgModule({
  declarations: [CoursegradelimitComponent],
  imports: [
    SharedModule,
    
    GradelimitRoutingModule,
  ]
})
export class GradelimitModule { }
