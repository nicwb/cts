import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FirstPensionBillPrintComponent } from './first-pension-bill.print.component';

describe('FirstPensionComponent', () => {
    let component: FirstPensionBillPrintComponent;
    let fixture: ComponentFixture<FirstPensionBillPrintComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ FirstPensionBillPrintComponent ]
        })
            .compileComponents();

        fixture = TestBed.createComponent(FirstPensionBillPrintComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
