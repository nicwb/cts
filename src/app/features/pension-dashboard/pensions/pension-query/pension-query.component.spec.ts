import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PensionQueryComponent } from './pension-query.component';

describe('PensionQueryComponent', () => {
    let component: PensionQueryComponent;
    let fixture: ComponentFixture<PensionQueryComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ PensionQueryComponent ]
        })
            .compileComponents();

        fixture = TestBed.createComponent(PensionQueryComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
