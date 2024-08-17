import { TestBed } from '@angular/core/testing';

import { PenionCatergoryMasterService } from './penion-catergory-master.service';

describe('PenionCatergoryMasterService', () => {
  let service: PenionCatergoryMasterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PenionCatergoryMasterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
