import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RevisionofComponentsComponent } from './revisionof-components.component';

describe('RevisionofComponentsComponent', () => {
    let component: RevisionofComponentsComponent;
    let fixture: ComponentFixture<RevisionofComponentsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ RevisionofComponentsComponent ]
        })
            .compileComponents();

        fixture = TestBed.createComponent(RevisionofComponentsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
