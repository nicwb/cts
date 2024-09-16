import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChequeComponent } from './cheque.component';

describe('ChequeComponent', () => {
    let component: ChequeComponent;
    let fixture: ComponentFixture<ChequeComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ ChequeComponent ]
        })
            .compileComponents();

        fixture = TestBed.createComponent(ChequeComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
