import { NgModule } from '@angular/core';

import { RevertresultprocessComponent } from './revertresultprocess/revertresultprocess.component';
import { SharedModule } from '../shared/shared.module';



@NgModule({
  declarations: [RevertresultprocessComponent],
  imports: [
    SharedModule
  ]
})
export class RevertresultModule { }
