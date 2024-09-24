import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComponentRateRevisionsComponent } from './component-rate-revisions.component';

describe('ComponentRateRevisionsComponent', () => {
    let component: ComponentRateRevisionsComponent;
    let fixture: ComponentFixture<ComponentRateRevisionsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ ComponentRateRevisionsComponent ]
        })
            .compileComponents();

        fixture = TestBed.createComponent(ComponentRateRevisionsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
