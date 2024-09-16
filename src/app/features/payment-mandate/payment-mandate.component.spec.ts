import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentMandateComponent } from './payment-mandate.component';

describe('PaymentMandateComponent', () => {
    let component: PaymentMandateComponent;
    let fixture: ComponentFixture<PaymentMandateComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ PaymentMandateComponent ]
        })
            .compileComponents();

        fixture = TestBed.createComponent(PaymentMandateComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
