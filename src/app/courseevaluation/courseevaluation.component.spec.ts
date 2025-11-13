import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseevaluationComponent } from './courseevaluation.component';

describe('CourseevaluationComponent', () => {
  let component: CourseevaluationComponent;
  let fixture: ComponentFixture<CourseevaluationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CourseevaluationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CourseevaluationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
