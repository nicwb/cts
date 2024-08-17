import { TestBed } from '@angular/core/testing';

import { FirstPensionBillGenerationPdfService } from './first-pension-bill-generation-pdf.service';

describe('FirstPensionBillGenerationPdfService', () => {
  let service: FirstPensionBillGenerationPdfService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FirstPensionBillGenerationPdfService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
