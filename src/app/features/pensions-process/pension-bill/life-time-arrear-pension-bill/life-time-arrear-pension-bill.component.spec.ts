import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LifeTimeArrearPensionBillComponent } from './life-time-arrear-pension-bill.component';

describe('LifeTimeArrearPensionBillComponent', () => {
    let component: LifeTimeArrearPensionBillComponent;
    let fixture: ComponentFixture<LifeTimeArrearPensionBillComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ LifeTimeArrearPensionBillComponent ]
        })
            .compileComponents();

        fixture = TestBed.createComponent(LifeTimeArrearPensionBillComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
