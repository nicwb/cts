import { TestBed } from '@angular/core/testing';

import { StampInvoiceService } from './stamp-invoice.service';

describe('StampInvoiceService', () => {
    let service: StampInvoiceService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(StampInvoiceService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
