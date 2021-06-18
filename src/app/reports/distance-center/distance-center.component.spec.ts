import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DistanceCenterComponent } from './distance-center.component';

describe('DistanceCenterComponent', () => {
  let component: DistanceCenterComponent;
  let fixture: ComponentFixture<DistanceCenterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DistanceCenterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DistanceCenterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
