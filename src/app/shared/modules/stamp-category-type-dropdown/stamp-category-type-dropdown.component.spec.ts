import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StampCategoryTypeDropdownComponent } from './stamp-category-type-dropdown.component';

describe('StampCategoryTypeDropdownComponent', () => {
    let component: StampCategoryTypeDropdownComponent;
    let fixture: ComponentFixture<StampCategoryTypeDropdownComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ StampCategoryTypeDropdownComponent ]
        })
            .compileComponents();

        fixture = TestBed.createComponent(StampCategoryTypeDropdownComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
