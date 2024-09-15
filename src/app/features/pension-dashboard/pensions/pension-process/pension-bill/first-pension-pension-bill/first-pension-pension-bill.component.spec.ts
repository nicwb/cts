import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FirstPensionPensionBillComponent } from './first-pension-pension-bill.component';

describe('FirstPensionPensionBillComponent', () => {
    let component: FirstPensionPensionBillComponent;
    let fixture: ComponentFixture<FirstPensionPensionBillComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ FirstPensionPensionBillComponent ]
        })
            .compileComponents();

        fixture = TestBed.createComponent(FirstPensionPensionBillComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
