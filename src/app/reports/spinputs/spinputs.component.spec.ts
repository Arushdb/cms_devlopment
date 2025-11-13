import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpinputsComponent } from './spinputs.component';

describe('SpinputsComponent', () => {
  let component: SpinputsComponent;
  let fixture: ComponentFixture<SpinputsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpinputsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpinputsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
