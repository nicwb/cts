import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PensionCategoryComponent } from './pension-category.component';

describe('PensionCategoryComponent', () => {
    let component: PensionCategoryComponent;
    let fixture: ComponentFixture<PensionCategoryComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ PensionCategoryComponent ]
        })
            .compileComponents();

        fixture = TestBed.createComponent(PensionCategoryComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
