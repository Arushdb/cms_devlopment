import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmwindowComponent } from './confirmwindow.component';

describe('ConfirmwindowComponent', () => {
  let component: ConfirmwindowComponent;
  let fixture: ComponentFixture<ConfirmwindowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmwindowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmwindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
