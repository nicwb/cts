import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StaticLoginComponent } from './static-login.component';

describe('StaticLoginComponent', () => {
    let component: StaticLoginComponent;
    let fixture: ComponentFixture<StaticLoginComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ StaticLoginComponent ]
        })
            .compileComponents();

        fixture = TestBed.createComponent(StaticLoginComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
