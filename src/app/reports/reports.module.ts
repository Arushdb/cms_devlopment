import { NgModule } from '@angular/core';
import { DistanceCenterComponent } from './distance-center/distance-center.component';
import { SharedModule} from '../shared/shared.module';
import { SpreportsComponent } from './spreports/spreports.component';
import { SpinputsComponent } from './spinputs/spinputs.component'; //  'src/app/shared/shared.module'


@NgModule ({
  declarations: [DistanceCenterComponent, SpreportsComponent, SpinputsComponent],
  imports: [SharedModule ]
})

export class ReportsModule { }
