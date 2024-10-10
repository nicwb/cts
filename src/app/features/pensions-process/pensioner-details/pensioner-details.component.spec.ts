import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PensionerDetailsComponent } from './pensioner-details.component';

describe('PensionerDetailsComponent', () => {
    let component: PensionerDetailsComponent;
    let fixture: ComponentFixture<PensionerDetailsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ PensionerDetailsComponent ]
        })
            .compileComponents();

        fixture = TestBed.createComponent(PensionerDetailsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
