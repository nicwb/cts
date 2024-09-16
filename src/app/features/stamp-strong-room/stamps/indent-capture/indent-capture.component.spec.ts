import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndentCaptureComponent } from './indent-capture.component';

describe('IndentCaptureComponent', () => {
    let component: IndentCaptureComponent;
    let fixture: ComponentFixture<IndentCaptureComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ IndentCaptureComponent ]
        })
            .compileComponents();

        fixture = TestBed.createComponent(IndentCaptureComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
