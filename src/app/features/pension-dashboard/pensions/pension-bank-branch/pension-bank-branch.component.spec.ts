import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PensionBankBranchComponent } from './pension-bank-branch.component';

describe('PensionBankBranchComponent', () => {
    let component: PensionBankBranchComponent;
    let fixture: ComponentFixture<PensionBankBranchComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ PensionBankBranchComponent ]
        })
            .compileComponents();

        fixture = TestBed.createComponent(PensionBankBranchComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
