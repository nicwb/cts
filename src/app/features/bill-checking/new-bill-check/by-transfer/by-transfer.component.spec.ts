import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ByTransferComponent } from './by-transfer.component';

describe('ByTransferComponent', () => {
    let component: ByTransferComponent;
    let fixture: ComponentFixture<ByTransferComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ ByTransferComponent ]
        })
            .compileComponents();

        fixture = TestBed.createComponent(ByTransferComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
