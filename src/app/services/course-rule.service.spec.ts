import { TestBed } from '@angular/core/testing';

import { CourseRuleService } from './course-rule.service';

describe('CourseRuleService', () => {
  let service: CourseRuleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CourseRuleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
