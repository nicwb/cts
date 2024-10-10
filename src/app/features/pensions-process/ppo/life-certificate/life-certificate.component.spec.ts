import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LifeCertificateComponent } from './life-certificate.component';

describe('LifeCertificateComponent', () => {
    let component: LifeCertificateComponent;
    let fixture: ComponentFixture<LifeCertificateComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ LifeCertificateComponent ]
        })
            .compileComponents();

        fixture = TestBed.createComponent(LifeCertificateComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
