import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StartactivityComponent } from './startactivity.component';

describe('StartactivityComponent', () => {
  let component: StartactivityComponent;
  let fixture: ComponentFixture<StartactivityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StartactivityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StartactivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
