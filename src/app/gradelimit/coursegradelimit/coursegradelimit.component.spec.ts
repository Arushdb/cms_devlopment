import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CoursegradelimitComponent } from './coursegradelimit.component';

describe('CoursegradelimitComponent', () => {
  let component: CoursegradelimitComponent;
  let fixture: ComponentFixture<CoursegradelimitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoursegradelimitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoursegradelimitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
