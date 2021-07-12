import { TestBed } from '@angular/core/testing';

import { FlleserviceService } from './flleservice.service';

describe('FlleserviceService', () => {
  let service: FlleserviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FlleserviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
