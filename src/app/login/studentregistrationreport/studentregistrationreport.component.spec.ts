import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentregistrationreportComponent } from './studentregistrationreport.component';

describe('StudentregistrationreportComponent', () => {
  let component: StudentregistrationreportComponent;
  let fixture: ComponentFixture<StudentregistrationreportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudentregistrationreportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentregistrationreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
