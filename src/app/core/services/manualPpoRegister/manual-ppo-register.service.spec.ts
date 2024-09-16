import { TestBed } from '@angular/core/testing';

import { ManualPpoRegisterService } from './manual-ppo-register.service';

describe('ManualPpoRegisterService', () => {
    let service: ManualPpoRegisterService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ManualPpoRegisterService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
