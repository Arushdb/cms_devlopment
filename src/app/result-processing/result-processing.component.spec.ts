import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultProcessingComponent } from './result-processing.component';

describe('ResultProcessingComponent', () => {
  let component: ResultProcessingComponent;
  let fixture: ComponentFixture<ResultProcessingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResultProcessingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultProcessingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
