import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InstructorcourseComponent } from './instructorcourse.component';

describe('InstructorcourseComponent', () => {
  let component: InstructorcourseComponent;
  let fixture: ComponentFixture<InstructorcourseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InstructorcourseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InstructorcourseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
