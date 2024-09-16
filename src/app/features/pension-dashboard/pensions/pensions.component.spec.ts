import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PensionsComponent } from './pensions.component';

describe('PensionsComponent', () => {
    let component: PensionsComponent;
    let fixture: ComponentFixture<PensionsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ PensionsComponent ]
        })
            .compileComponents();

        fixture = TestBed.createComponent(PensionsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
