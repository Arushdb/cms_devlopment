import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CoursepcklistComponent } from './coursepcklist.component';

describe('CoursepcklistComponent', () => {
  let component: CoursepcklistComponent;
  let fixture: ComponentFixture<CoursepcklistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoursepcklistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoursepcklistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
