import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManualPpoRegisterComponent } from './manual-ppo-register.component';

describe('ManualPpoRegisterComponent', () => {
    let component: ManualPpoRegisterComponent;
    let fixture: ComponentFixture<ManualPpoRegisterComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ ManualPpoRegisterComponent ]
        })
            .compileComponents();

        fixture = TestBed.createComponent(ManualPpoRegisterComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
