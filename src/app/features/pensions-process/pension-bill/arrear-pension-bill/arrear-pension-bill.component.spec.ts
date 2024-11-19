import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArrearPensionBillComponent } from './arrear-pension-bill.component';

describe('ArrearPensionBillComponent', () => {
    let component: ArrearPensionBillComponent;
    let fixture: ComponentFixture<ArrearPensionBillComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ ArrearPensionBillComponent ]
        })
            .compileComponents();

        fixture = TestBed.createComponent(ArrearPensionBillComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
