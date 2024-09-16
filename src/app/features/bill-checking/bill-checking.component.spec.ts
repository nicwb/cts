import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillCheckingComponent } from './bill-checking.component';

describe('BillCheckingComponent', () => {
    let component: BillCheckingComponent;
    let fixture: ComponentFixture<BillCheckingComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ BillCheckingComponent ]
        })
            .compileComponents();

        fixture = TestBed.createComponent(BillCheckingComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
