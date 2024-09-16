import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillReceiveListComponent } from './bill-receive-list.component';

describe('BillReceiveListComponent', () => {
    let component: BillReceiveListComponent;
    let fixture: ComponentFixture<BillReceiveListComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ BillReceiveListComponent ]
        })
            .compileComponents();

        fixture = TestBed.createComponent(BillReceiveListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
