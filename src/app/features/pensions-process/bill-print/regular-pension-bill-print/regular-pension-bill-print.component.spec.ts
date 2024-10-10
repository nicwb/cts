import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegularPensionBillPrintComponent } from './regular-pension-bill-print.component';

describe('RegularPensionComponent', () => {
    let component: RegularPensionBillPrintComponent;
    let fixture: ComponentFixture<RegularPensionBillPrintComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ RegularPensionBillPrintComponent ]
        })
            .compileComponents();

        fixture = TestBed.createComponent(RegularPensionBillPrintComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
