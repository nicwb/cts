import { TestBed } from '@angular/core/testing';

import { ChequeInvoiceService } from './cheque-invoice.service';

describe('ChequeInvoiceService', () => {
    let service: ChequeInvoiceService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ChequeInvoiceService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
