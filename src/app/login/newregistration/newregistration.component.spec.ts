import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewregistrationComponent } from './newregistration.component';

describe('NewregistrationComponent', () => {
  let component: NewregistrationComponent;
  let fixture: ComponentFixture<NewregistrationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewregistrationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewregistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
