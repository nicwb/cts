import { TestBed } from '@angular/core/testing';

import { FileGenerationBillPrintService } from './file-generation-bill-print.service';

describe('FileGenerationBillPrintService', () => {
  let service: FileGenerationBillPrintService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FileGenerationBillPrintService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
