import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComponentRateComponent } from './component-rate.component';

describe('ComponentRateComponent', () => {
    let component: ComponentRateComponent;
    let fixture: ComponentFixture<ComponentRateComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ ComponentRateComponent ]
        })
            .compileComponents();

        fixture = TestBed.createComponent(ComponentRateComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});