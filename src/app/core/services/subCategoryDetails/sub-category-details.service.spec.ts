import { TestBed } from '@angular/core/testing';

import { SubCategoryDetailsService } from './sub-category-details.service';

describe('SubCategoryDetailsService', () => {
    let service: SubCategoryDetailsService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(SubCategoryDetailsService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
