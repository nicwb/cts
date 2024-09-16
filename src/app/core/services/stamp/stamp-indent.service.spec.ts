import { TestBed } from '@angular/core/testing';

import { StampIndentService } from './stamp-indent.service';

describe('StampIndentService', () => {
    let service: StampIndentService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(StampIndentService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
