import { Component } from '@angular/core';

@Component({
  selector: 'app-course-group-row',
  templateUrl: './course-group-row.component.html',
  styleUrls: ['./course-group-row.component.css']
})
export class CourseGroupRowComponent {

  params: any;

  agInit(params: any): void {
    this.params = params;
  }

  refresh(params: any): boolean {
    this.params = params;
    return true;
  }
}