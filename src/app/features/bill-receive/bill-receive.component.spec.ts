import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillReceiveComponent } from './bill-receive.component';

describe('BillReceiveComponent', () => {
    let component: BillReceiveComponent;
    let fixture: ComponentFixture<BillReceiveComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ BillReceiveComponent ]
        })
            .compileComponents();

        fixture = TestBed.createComponent(BillReceiveComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
