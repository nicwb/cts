import { TestBed } from '@angular/core/testing';

import { StampMasterService } from './stamp-master.service';

describe('StampMasterService', () => {
  let service: StampMasterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StampMasterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
