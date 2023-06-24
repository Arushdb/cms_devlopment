import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { MastersetupRoutingModule } from './mastersetup-routing.module';
import { InstructorlistComponent } from './instructorlist/instructorlist.component';
import { CoursepcklistComponent } from './coursepcklist/coursepcklist.component';
import { InstructorcourseComponent } from './instructorcourse/instructorcourse.component';


@NgModule({
  declarations: [InstructorlistComponent, CoursepcklistComponent, InstructorcourseComponent],
  imports: [ SharedModule,
    MastersetupRoutingModule
  ]
})

export class MastersetupModule { }
