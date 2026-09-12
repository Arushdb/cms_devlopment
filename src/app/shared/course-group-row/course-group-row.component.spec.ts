import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseGroupRowComponent } from './course-group-row.component';

describe('CourseGroupRowComponent', () => {
  let component: CourseGroupRowComponent;
  let fixture: ComponentFixture<CourseGroupRowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CourseGroupRowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CourseGroupRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
