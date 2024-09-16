import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayMandateShortlistComponent } from './pay-mandate-shortlist.component';

describe('PayMandateShortlistComponent', () => {
    let component: PayMandateShortlistComponent;
    let fixture: ComponentFixture<PayMandateShortlistComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ PayMandateShortlistComponent ]
        })
            .compileComponents();

        fixture = TestBed.createComponent(PayMandateShortlistComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
