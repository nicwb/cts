import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewDistributionComponent } from './new-distribution.component';

describe('NewDistributionComponent', () => {
    let component: NewDistributionComponent;
    let fixture: ComponentFixture<NewDistributionComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ NewDistributionComponent ]
        })
            .compileComponents();

        fixture = TestBed.createComponent(NewDistributionComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
