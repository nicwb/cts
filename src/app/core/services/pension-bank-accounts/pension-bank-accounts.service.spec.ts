import { TestBed } from '@angular/core/testing';

import { PensionBankAccountsService } from './pension-bank-accounts.service';

describe('PensionBankAccountsService', () => {
  let service: PensionBankAccountsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PensionBankAccountsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
