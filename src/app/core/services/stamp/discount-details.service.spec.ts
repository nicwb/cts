import { TestBed } from '@angular/core/testing';

import { DiscountDetailsService } from './discount-details.service';

describe('DiscountDetailsService', () => {
    let service: DiscountDetailsService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(DiscountDetailsService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
