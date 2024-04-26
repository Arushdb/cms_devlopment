import { TestBed } from '@angular/core/testing';

import { SchoolregistrationService } from './schoolregistration.service';

describe('SchoolregistrationService', () => {
  let service: SchoolregistrationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SchoolregistrationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
