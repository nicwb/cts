import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegularPensionBillComponent } from './regular-pension-bill.component';

describe('RegularPensionBillComponent', () => {
    let component: RegularPensionBillComponent;
    let fixture: ComponentFixture<RegularPensionBillComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ RegularPensionBillComponent ]
        })
            .compileComponents();

        fixture = TestBed.createComponent(RegularPensionBillComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
