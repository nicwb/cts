import { TestBed } from '@angular/core/testing';

import { FirstPensionService } from './first-pension.service';

describe('FirstPensionService', () => {
  let service: FirstPensionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FirstPensionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
