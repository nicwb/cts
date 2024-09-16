import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnlineBillComponent } from './online-bill.component';

describe('OnlineBillComponent', () => {
    let component: OnlineBillComponent;
    let fixture: ComponentFixture<OnlineBillComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ OnlineBillComponent ]
        })
            .compileComponents();

        fixture = TestBed.createComponent(OnlineBillComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
