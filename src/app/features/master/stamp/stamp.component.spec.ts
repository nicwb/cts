import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StampComponent } from './stamp.component';

describe('StampComponent', () => {
    let component: StampComponent;
    let fixture: ComponentFixture<StampComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ StampComponent ]
        })
            .compileComponents();

        fixture = TestBed.createComponent(StampComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
