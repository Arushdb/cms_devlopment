import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RxjsexampleComponent } from './rxjsexample.component';

describe('RxjsexampleComponent', () => {
  let component: RxjsexampleComponent;
  let fixture: ComponentFixture<RxjsexampleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RxjsexampleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RxjsexampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
