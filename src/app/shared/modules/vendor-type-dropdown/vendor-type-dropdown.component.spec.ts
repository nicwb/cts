import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorTypeDropdownComponent } from './vendor-type-dropdown.component';

describe('VendorTypeDropdownComponent', () => {
    let component: VendorTypeDropdownComponent;
    let fixture: ComponentFixture<VendorTypeDropdownComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ VendorTypeDropdownComponent ]
        })
            .compileComponents();

        fixture = TestBed.createComponent(VendorTypeDropdownComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
