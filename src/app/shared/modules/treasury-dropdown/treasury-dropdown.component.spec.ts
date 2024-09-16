import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TreasuryDropdownComponent } from './treasury-dropdown.component';

describe('TreasuryDropdownComponent', () => {
    let component: TreasuryDropdownComponent;
    let fixture: ComponentFixture<TreasuryDropdownComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ TreasuryDropdownComponent ]
        })
            .compileComponents();

        fixture = TestBed.createComponent(TreasuryDropdownComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
