import { TestBed } from '@angular/core/testing';

import { StampCombinationService } from './stamp-combination.service';

describe('StampCombinationService', () => {
    let service: StampCombinationService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(StampCombinationService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
