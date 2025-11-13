import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssigncoursesComponent } from './assigncourses.component';

describe('AssigncoursesComponent', () => {
  let component: AssigncoursesComponent;
  let fixture: ComponentFixture<AssigncoursesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssigncoursesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssigncoursesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
