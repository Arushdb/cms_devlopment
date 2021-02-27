import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SignonformComponent } from './signonform.component';

describe('SignonformComponent', () => {
  let component: SignonformComponent;
  let fixture: ComponentFixture<SignonformComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignonformComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignonformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
