import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChequeIndentInvoiceComponent } from './cheque-indent-invoice.component';

describe('ChequeIndentInvoiceComponent', () => {
    let component: ChequeIndentInvoiceComponent;
    let fixture: ComponentFixture<ChequeIndentInvoiceComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ ChequeIndentInvoiceComponent ]
        })
            .compileComponents();

        fixture = TestBed.createComponent(ChequeIndentInvoiceComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
