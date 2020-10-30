import { TestBed } from '@angular/core/testing';

import { FormatInterceptorService } from './format-interceptor.service';

describe('FormatInterceptorService', () => {
  let service: FormatInterceptorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FormatInterceptorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
