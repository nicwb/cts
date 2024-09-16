import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChequeReceivedComponent } from './cheque-received.component';

describe('ChequeReceivedComponent', () => {
    let component: ChequeReceivedComponent;
    let fixture: ComponentFixture<ChequeReceivedComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ ChequeReceivedComponent ]
        })
            .compileComponents();

        fixture = TestBed.createComponent(ChequeReceivedComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
