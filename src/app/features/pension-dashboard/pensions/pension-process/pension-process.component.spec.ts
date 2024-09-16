import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PensionProcessComponent } from './pension-process.component';

describe('PensionProcessComponent', () => {
    let component: PensionProcessComponent;
    let fixture: ComponentFixture<PensionProcessComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ PensionProcessComponent ]
        })
            .compileComponents();

        fixture = TestBed.createComponent(PensionProcessComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
