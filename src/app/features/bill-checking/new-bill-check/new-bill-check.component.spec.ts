import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewBillCheckComponent } from './new-bill-check.component';

describe('NewBillCheckComponent', () => {
    let component: NewBillCheckComponent;
    let fixture: ComponentFixture<NewBillCheckComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ NewBillCheckComponent ]
        })
            .compileComponents();

        fixture = TestBed.createComponent(NewBillCheckComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
