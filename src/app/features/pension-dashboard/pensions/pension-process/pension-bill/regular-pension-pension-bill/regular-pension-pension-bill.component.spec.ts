import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegularPensionPensionBillComponent } from './regular-pension-pension-bill.component';

describe('RegularPensionPensionBillComponent', () => {
    let component: RegularPensionPensionBillComponent;
    let fixture: ComponentFixture<RegularPensionPensionBillComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ RegularPensionPensionBillComponent ]
        })
            .compileComponents();

        fixture = TestBed.createComponent(RegularPensionPensionBillComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
