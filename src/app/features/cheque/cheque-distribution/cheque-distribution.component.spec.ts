import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChequeDistributionComponent } from './cheque-distribution.component';

describe('ChequeDistributionComponent', () => {
    let component: ChequeDistributionComponent;
    let fixture: ComponentFixture<ChequeDistributionComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ ChequeDistributionComponent ]
        })
            .compileComponents();

        fixture = TestBed.createComponent(ChequeDistributionComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
