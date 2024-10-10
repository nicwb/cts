import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PensionReportsComponent } from './pension-reports.component';

describe('PensionReportsComponent', () => {
    let component: PensionReportsComponent;
    let fixture: ComponentFixture<PensionReportsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ PensionReportsComponent ]
        })
            .compileComponents();

        fixture = TestBed.createComponent(PensionReportsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
