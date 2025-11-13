import { TestBed } from '@angular/core/testing';

import { CourseevaluationService } from './courseevaluation.service';

describe('CourseevaluationService', () => {
  let service: CourseevaluationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CourseevaluationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
