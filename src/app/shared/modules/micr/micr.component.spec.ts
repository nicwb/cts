import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MicrComponent } from './micr.component';

describe('MicrComponent', () => {
    let component: MicrComponent;
    let fixture: ComponentFixture<MicrComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ MicrComponent ]
        })
            .compileComponents();

        fixture = TestBed.createComponent(MicrComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
