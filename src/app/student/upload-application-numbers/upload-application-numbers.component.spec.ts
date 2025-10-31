import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadApplicationNumbersComponent } from './upload-application-numbers.component';

describe('UploadApplicationNumbersComponent', () => {
  let component: UploadApplicationNumbersComponent;
  let fixture: ComponentFixture<UploadApplicationNumbersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadApplicationNumbersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadApplicationNumbersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
