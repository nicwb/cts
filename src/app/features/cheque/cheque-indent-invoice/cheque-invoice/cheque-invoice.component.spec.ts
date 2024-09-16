import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChequeInvoiceComponent } from './cheque-invoice.component';

describe('ChequeInvoiceComponent', () => {
    let component: ChequeInvoiceComponent;
    let fixture: ComponentFixture<ChequeInvoiceComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ ChequeInvoiceComponent ]
        })
            .compileComponents();

        fixture = TestBed.createComponent(ChequeInvoiceComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
