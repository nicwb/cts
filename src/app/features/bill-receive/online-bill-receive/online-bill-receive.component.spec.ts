import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnlineBillReceiveComponent } from './online-bill-receive.component';

describe('OnlineBillReceiveComponent', () => {
    let component: OnlineBillReceiveComponent;
    let fixture: ComponentFixture<OnlineBillReceiveComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ OnlineBillReceiveComponent ]
        })
            .compileComponents();

        fixture = TestBed.createComponent(OnlineBillReceiveComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
