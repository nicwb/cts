import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChequeIndentComponent } from './cheque-indent.component';

describe('ChequeIndentComponent', () => {
    let component: ChequeIndentComponent;
    let fixture: ComponentFixture<ChequeIndentComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ ChequeIndentComponent ]
        })
            .compileComponents();

        fixture = TestBed.createComponent(ChequeIndentComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
