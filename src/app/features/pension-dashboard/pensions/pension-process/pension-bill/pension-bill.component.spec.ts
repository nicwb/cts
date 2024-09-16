import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PensionBillComponent } from './pension-bill.component';

describe('PensionBillComponent', () => {
    let component: PensionBillComponent;
    let fixture: ComponentFixture<PensionBillComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ PensionBillComponent ]
        })
            .compileComponents();

        fixture = TestBed.createComponent(PensionBillComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
