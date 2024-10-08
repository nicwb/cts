import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PpoReceiptComponent } from './ppo-receipt.component';

describe('ManualPpoReceiptComponent', () => {
    let component: PpoReceiptComponent;
    let fixture: ComponentFixture<PpoReceiptComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ PpoReceiptComponent ]
        })
            .compileComponents();

        fixture = TestBed.createComponent(PpoReceiptComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
