import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GriddialogComponent } from './griddialog.component';

describe('GriddialogComponent', () => {
  let component: GriddialogComponent;
  let fixture: ComponentFixture<GriddialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GriddialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GriddialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
