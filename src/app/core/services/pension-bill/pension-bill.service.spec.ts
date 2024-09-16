import { TestBed } from '@angular/core/testing';

import { PensionBillService } from './pension-bill.service';

describe('PensionBillService', () => {
    let service: PensionBillService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(PensionBillService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
