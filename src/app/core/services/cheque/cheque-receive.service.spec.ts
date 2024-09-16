import { TestBed } from '@angular/core/testing';

import { ChequeReceiveService } from './cheque-receive.service';

describe('ChequeReceiveService', () => {
    let service: ChequeReceiveService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ChequeReceiveService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
