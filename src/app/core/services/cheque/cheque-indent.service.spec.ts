import { TestBed } from '@angular/core/testing';

import { ChequeIndentService } from './cheque-indent.service';

describe('ChequeIndentService', () => {
    let service: ChequeIndentService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ChequeIndentService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
