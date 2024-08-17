import { TestBed } from '@angular/core/testing';

import { BillPrintService } from './bill-print.service';

describe('BillPrintService', () => {
  let service: BillPrintService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BillPrintService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
