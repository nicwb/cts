import { TestBed } from '@angular/core/testing';

import { PaymandateService } from './paymandate.service';

describe('PaymandateService', () => {
    let service: PaymandateService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(PaymandateService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
