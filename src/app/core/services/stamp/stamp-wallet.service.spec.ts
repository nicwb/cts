import { TestBed } from '@angular/core/testing';

import { StampWalletService } from './stamp-wallet.service';

describe('StampWalletService', () => {
    let service: StampWalletService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(StampWalletService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
