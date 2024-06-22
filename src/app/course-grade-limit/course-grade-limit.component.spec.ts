import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseGradeLimitComponent } from './course-grade-limit.component';

describe('CourseGradeLimitComponent', () => {
  let component: CourseGradeLimitComponent;
  let fixture: ComponentFixture<CourseGradeLimitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CourseGradeLimitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CourseGradeLimitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
