import { TestBed } from '@angular/core/testing';

import { PpoDetailsService } from './ppo-details.service';

describe('PpoDetailsService', () => {
    let service: PpoDetailsService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(PpoDetailsService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
