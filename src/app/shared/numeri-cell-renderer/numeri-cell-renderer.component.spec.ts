import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NumeriCellRendererComponent } from './numeri-cell-renderer.component';

describe('NumeriCellRendererComponent', () => {
  let component: NumeriCellRendererComponent;
  let fixture: ComponentFixture<NumeriCellRendererComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NumeriCellRendererComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NumeriCellRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
