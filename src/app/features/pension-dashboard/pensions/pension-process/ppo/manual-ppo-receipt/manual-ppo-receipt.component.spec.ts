import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManualPpoReceiptComponent } from './manual-ppo-receipt.component';

describe('ManualPpoReceiptComponent', () => {
    let component: ManualPpoReceiptComponent;
    let fixture: ComponentFixture<ManualPpoReceiptComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ ManualPpoReceiptComponent ]
        })
            .compileComponents();

        fixture = TestBed.createComponent(ManualPpoReceiptComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
