import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SchoolStudentDetailComponent } from './school-student-detail.component';

describe('SchoolStudentDetailComponent', () => {
  let component: SchoolStudentDetailComponent;
  let fixture: ComponentFixture<SchoolStudentDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SchoolStudentDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchoolStudentDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
