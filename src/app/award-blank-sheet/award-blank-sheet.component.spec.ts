import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AwardBlankSheetComponent } from './award-blank-sheet.component';

describe('AwardBlankSheetComponent', () => {
  let component: AwardBlankSheetComponent;
  let fixture: ComponentFixture<AwardBlankSheetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AwardBlankSheetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AwardBlankSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
