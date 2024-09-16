import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArrearPensionComponent } from './arrear-pension.component';

describe('ArrearPensionComponent', () => {
    let component: ArrearPensionComponent;
    let fixture: ComponentFixture<ArrearPensionComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ ArrearPensionComponent ]
        })
            .compileComponents();

        fixture = TestBed.createComponent(ArrearPensionComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
