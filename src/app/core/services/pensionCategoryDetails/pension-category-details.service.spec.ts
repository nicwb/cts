import { TestBed } from '@angular/core/testing';

import { PensionCategoryDetailsService } from './pension-category-details.service';

describe('PensionCategoryDetailsService', () => {
    let service: PensionCategoryDetailsService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(PensionCategoryDetailsService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
