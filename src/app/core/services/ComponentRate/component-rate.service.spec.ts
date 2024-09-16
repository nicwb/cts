import { TestBed } from '@angular/core/testing';

import { ComponentRateService } from './component-rate.service';

describe('ComponentRateService', () => {
    let service: ComponentRateService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ComponentRateService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
