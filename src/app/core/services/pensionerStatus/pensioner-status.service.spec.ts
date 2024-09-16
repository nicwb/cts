import { TestBed } from '@angular/core/testing';

import { PensionerStatusService } from './pensioner-status.service';

describe('PensionerStatusService', () => {
    let service: PensionerStatusService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(PensionerStatusService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
