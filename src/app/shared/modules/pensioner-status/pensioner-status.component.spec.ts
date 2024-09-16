import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PensionerStatusComponent } from './pensioner-status.component';

describe('PensionerStatusComponent', () => {
    let component: PensionerStatusComponent;
    let fixture: ComponentFixture<PensionerStatusComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ PensionerStatusComponent ]
        })
            .compileComponents();

        fixture = TestBed.createComponent(PensionerStatusComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
