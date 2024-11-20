import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FamilyPensionApprovalComponent } from './family-pension-approval.component';

describe('FamilyPensionApprovalComponent', () => {
    let component: FamilyPensionApprovalComponent;
    let fixture: ComponentFixture<FamilyPensionApprovalComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ FamilyPensionApprovalComponent ]
        })
            .compileComponents();

        fixture = TestBed.createComponent(FamilyPensionApprovalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
