import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GridrendererComponent } from './gridrenderer.component';

describe('GridrendererComponent', () => {
  let component: GridrendererComponent;
  let fixture: ComponentFixture<GridrendererComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GridrendererComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GridrendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
