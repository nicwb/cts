import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConvartToFamilyPensionComponent } from './convart-to-family-pension.component';

describe('ConvartToFamilyPensionComponent', () => {
    let component: ConvartToFamilyPensionComponent;
    let fixture: ComponentFixture<ConvartToFamilyPensionComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ ConvartToFamilyPensionComponent ]
        })
            .compileComponents();

        fixture = TestBed.createComponent(ConvartToFamilyPensionComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
