import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RevertresultprocessComponent } from './revertresultprocess.component';

describe('RevertresultprocessComponent', () => {
  let component: RevertresultprocessComponent;
  let fixture: ComponentFixture<RevertresultprocessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RevertresultprocessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RevertresultprocessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
