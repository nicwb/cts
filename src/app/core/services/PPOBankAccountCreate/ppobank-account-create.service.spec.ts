import { TestBed } from '@angular/core/testing';

import { PPOBankAccountCreateService } from './ppobank-account-create.service';

describe('PPOBankAccountCreateService', () => {
    let service: PPOBankAccountCreateService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(PPOBankAccountCreateService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
