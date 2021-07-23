import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentpersonaldetailComponent } from './studentpersonaldetail.component';

describe('StudentpersonaldetailComponent', () => {
  let component: StudentpersonaldetailComponent;
  let fixture: ComponentFixture<StudentpersonaldetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudentpersonaldetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentpersonaldetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
