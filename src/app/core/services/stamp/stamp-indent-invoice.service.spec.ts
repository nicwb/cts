import { TestBed } from '@angular/core/testing';

import { StampIndentInvoiceService } from './stamp-indent-invoice.service';

describe('StampIndentInvoiceService', () => {
  let service: StampIndentInvoiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StampIndentInvoiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
