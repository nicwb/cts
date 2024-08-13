import { TestBed } from '@angular/core/testing';

import { StampReportsService } from './stamp-reports.service';

describe('StampReportsService', () => {
  let service: StampReportsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StampReportsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
