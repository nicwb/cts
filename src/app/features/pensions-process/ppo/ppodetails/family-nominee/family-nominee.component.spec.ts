import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FamilyNomineeComponent } from './family-nominee.component';

describe('FamilyNomineeComponent', () => {
    let component: FamilyNomineeComponent;
    let fixture: ComponentFixture<FamilyNomineeComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ FamilyNomineeComponent ]
        })
            .compileComponents();

        fixture = TestBed.createComponent(FamilyNomineeComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
