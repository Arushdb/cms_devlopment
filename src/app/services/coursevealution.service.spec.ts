import { TestBed } from '@angular/core/testing';

import { CoursevealutionService } from './coursevealution.service';

describe('CoursevealutionService', () => {
  let service: CoursevealutionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CoursevealutionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
