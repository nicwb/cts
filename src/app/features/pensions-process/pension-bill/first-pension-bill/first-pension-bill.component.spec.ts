import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FirstPensionBillComponent } from './first-pension-bill.component';

describe('PensionBillComponent', () => {
    let component: FirstPensionBillComponent;
    let fixture: ComponentFixture<FirstPensionBillComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ FirstPensionBillComponent ]
        })
            .compileComponents();

        fixture = TestBed.createComponent(FirstPensionBillComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
