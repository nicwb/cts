import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceCaptureComponent } from './invoice-capture.component';

describe('InvoiceCaptureComponent', () => {
    let component: InvoiceCaptureComponent;
    let fixture: ComponentFixture<InvoiceCaptureComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ InvoiceCaptureComponent ]
        })
            .compileComponents();

        fixture = TestBed.createComponent(InvoiceCaptureComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
