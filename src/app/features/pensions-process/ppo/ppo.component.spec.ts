import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PpoComponent } from './ppo.component';

describe('PpoComponent', () => {
    let component: PpoComponent;
    let fixture: ComponentFixture<PpoComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ PpoComponent ]
        })
            .compileComponents();

        fixture = TestBed.createComponent(PpoComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
