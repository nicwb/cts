import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StampCombinationDropdownComponent } from './stamp-combination-dropdown.component';

describe('StampCombinationDropdownComponent', () => {
    let component: StampCombinationDropdownComponent;
    let fixture: ComponentFixture<StampCombinationDropdownComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ StampCombinationDropdownComponent ]
        })
            .compileComponents();

        fixture = TestBed.createComponent(StampCombinationDropdownComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
