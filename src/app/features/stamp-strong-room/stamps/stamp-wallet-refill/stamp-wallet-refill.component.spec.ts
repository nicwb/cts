import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StampWalletRefillComponent } from './stamp-wallet-refill.component';

describe('StampWalletRefillComponent', () => {
    let component: StampWalletRefillComponent;
    let fixture: ComponentFixture<StampWalletRefillComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ StampWalletRefillComponent ]
        })
            .compileComponents();

        fixture = TestBed.createComponent(StampWalletRefillComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
