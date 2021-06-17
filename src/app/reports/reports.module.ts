import { NgModule } from '@angular/core';
import { ReportsRoutingModule } from './reports-routing.module';
import { DistanceCenterComponent } from './distance-center/distance-center.component';
import { SharedModule} from '../shared/shared.module'; //  'src/app/shared/shared.module'


@NgModule({
  declarations: [DistanceCenterComponent],
  imports: [
    ReportsRoutingModule,
    SharedModule
  ]
})
export class ReportsModule { }