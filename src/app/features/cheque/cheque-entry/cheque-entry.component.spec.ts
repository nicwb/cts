import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChequeEntryComponent } from './cheque-entry.component';

describe('ChequeEntryComponent', () => {
    let component: ChequeEntryComponent;
    let fixture: ComponentFixture<ChequeEntryComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ ChequeEntryComponent ]
        })
            .compileComponents();

        fixture = TestBed.createComponent(ChequeEntryComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
