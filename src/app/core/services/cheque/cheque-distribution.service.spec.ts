import { TestBed } from '@angular/core/testing';

import { ChequeDistributionService } from './cheque-distribution.service';

describe('ChequeDistributionService', () => {
    let service: ChequeDistributionService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ChequeDistributionService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
