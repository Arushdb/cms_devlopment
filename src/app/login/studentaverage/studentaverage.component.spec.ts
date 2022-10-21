import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentaverageComponent } from './studentaverage.component';

describe('StudentaverageComponent', () => {
  let component: StudentaverageComponent;
  let fixture: ComponentFixture<StudentaverageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudentaverageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentaverageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
