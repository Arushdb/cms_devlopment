import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentconsentComponent } from './studentconsent.component';

describe('StudentconsentComponent', () => {
  let component: StudentconsentComponent;
  let fixture: ComponentFixture<StudentconsentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudentconsentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentconsentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
