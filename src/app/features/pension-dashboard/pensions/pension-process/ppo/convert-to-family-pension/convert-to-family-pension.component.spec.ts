import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConvertToFamilyPensionComponent } from './convert-to-family-pension.component';

describe('ConvertToFamilyPensionComponent', () => {
    let component: ConvertToFamilyPensionComponent;
    let fixture: ComponentFixture<ConvertToFamilyPensionComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ ConvertToFamilyPensionComponent ]
        })
            .compileComponents();

        fixture = TestBed.createComponent(ConvertToFamilyPensionComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
